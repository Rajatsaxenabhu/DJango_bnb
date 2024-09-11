interface ProfileFormData {
    name: string;
    image?: File; // Optional, since image might not be provided
    pk: string;
  }

const UpdateForm = (data: ProfileFormData): FormData => {
    const formData = new FormData();
    
    formData.append('name', data.name);
    
    if (data.image) {
      formData.append('image', data.image);
    }
    
    formData.append('pk', data.pk);
  
    return formData;
  };
  