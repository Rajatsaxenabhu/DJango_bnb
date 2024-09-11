from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes

from .models import User
from .serializers import UserDetailSerializer

from property.serializers import ReservationsListSerializer


@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def landlord_detail(request, pk):
    user = User.objects.get(pk=pk)
    serializer = UserDetailSerializer(user, many=False)
    return JsonResponse(serializer.data, safe=False)


@api_view(['GET'])
def reservations_list(request):
    reservations = request.user.reservations.all()

    print('user', request.user)
    print(reservations)
    
    serializer = ReservationsListSerializer(reservations, many=True)
    return JsonResponse(serializer.data, safe=False)

# views.py
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import UserProfileSerializer

@api_view(['POST', 'FILES'])
def update_profile(request):
    
    user_id = request.data.get('pk')  # Get user ID from request data
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    print("Request:", request.data.get('avatar'))
    print("user",user.avatar)
    # Ensure that files are included in the request
    serializer = UserProfileSerializer(user,request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response({'status': 'Profile updated successfully'}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
