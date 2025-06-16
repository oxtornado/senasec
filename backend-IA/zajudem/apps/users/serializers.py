from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
import requests

User = get_user_model()

class UsuarioSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username', 'documento', 'email', 'telefono', 'rol', 'password', 'face_token']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        face_token = validated_data.get('face_token')

        user = User.objects.create_user(
            username=validated_data['username'],
            documento=validated_data['documento'],
            email=validated_data['email'],
            telefono=validated_data.get('telefono'),
            rol=validated_data.get('rol', 'instructor'),
            password=validated_data['password']
        )

        if face_token:
            user.face_token = face_token
            user.save()

        return user
    
        # Si se envió imagen, llamamos a la API de Face++ para obtener el token
        #if image:
        #    import requests
        #    API_KEY = "yi4Dn_MR-Xx-xNaMCRli9XOIgWl8KnZP"
        #    API_SECRET = "tyxWMjsNMPKpycsFuu-BkJU-aJj-9ja7"
        #    FACE_DETECT_URL = "https://api-us.faceplusplus.com/facepp/v3/detect" # endpoint de face ++ para dectar un rostro 
        #
        #    files = {"image_file": (image.name, image, image.content_type)}
        #    data = {"api_key": API_KEY, "api_secret": API_SECRET}
        #    response = requests.post(FACE_DETECT_URL, files=files, data=data)
        #    result = response.json()

        #    if result.get("faces"):
        #        face_token = result["faces"][0]["face_token"]
        #        user.face_token = face_token
        #        user.save()
        #        self.context['face_token'] = face_token  # para incluirlo en la respuesta
        #    else:
        #        user.delete()
        #        raise serializers.ValidationError("No se detectó ningún rostro en la imagen enviada")
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Añadimos el face_token si se generó
        if hasattr(instance, 'face_token'):
            data['face_token'] = instance.face_token
        return data
    

    def update(self, instance, validated_data):
        # Verificar si el usuario intenta cambiar el documento
        if 'documento' in validated_data:
            request = self.context.get('request')
            if request.user.rol != 'admin':
                raise serializers.ValidationError("No tienes permiso para cambiar el documento.")
            
        # Actualizar el resto de los campos
        for attr, value in validated_data.items():
            if attr == 'password':
                instance.set_password(value)
            else:
                setattr(instance, attr, value)
        instance.save()
        return instance
    

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'documento'  # <- Esto indica que usaremos el campo documento para la autenticación

    def validate(self, attrs):
        # Sobrescribimos para usar 'documento' y 'password'
        documento = attrs.get("documento")
        password = attrs.get("password")

        user = authenticate(request=self.context.get('request'), documento=documento, password=password)

        if not user:
            raise serializers.ValidationError("Credenciales inválidas, verifica tu correo y contraseña.")

        data = super().validate(attrs)
        data['user'] = {
            "id": user.id,
            "username": user.username,
            "documento": user.documento,
            "email": user.email,
            "rol": user.rol,
        }
        return data