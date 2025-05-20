import { ID, Query } from 'appwrite';
import { appwriteConfig, databases, storage } from './appwrite';
import { IBrand } from '@/types';

// Create a new brand
export async function createBrand(brand: {
  name: string;
  description?: string;
  logo?: File;
  banner?: File;
  owner: string;
}) {
  try {
    // Upload logo if provided
    let logoUrl = '';
    if (brand.logo) {
      const uploadedLogo = await uploadFile(brand.logo);
      if (uploadedLogo) {
        logoUrl = getFilePreview(uploadedLogo.$id);
      }
    }

    // Upload banner if provided
    let bannerUrl = '';
    if (brand.banner) {
      const uploadedBanner = await uploadFile(brand.banner);
      if (uploadedBanner) {
        bannerUrl = getFilePreview(uploadedBanner.$id);
      }
    }

    // Create slug from brand name
    const slug = brand.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-');

    // Create brand document
    const newBrand = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.brandCollectionId,
      ID.unique(),
      {
        name: brand.name,
        slug,
        description: brand.description || '',
        logoUrl,
        bannerUrl,
        owner: brand.owner,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );

    return newBrand;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Get a brand by ID
export async function getBrandById(brandId: string) {
  try {
    const brand = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.brandCollectionId,
      brandId
    );

    return brand;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Get a brand by slug
export async function getBrandBySlug(slug: string) {
  try {
    const brands = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.brandCollectionId,
      [Query.equal('slug', slug)]
    );

    if (brands.documents.length === 0) {
      throw new Error('Brand not found');
    }

    return brands.documents[0] as IBrand;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Get brands by owner
export async function getBrandsByOwner(ownerId: string) {
  try {
    const brands = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.brandCollectionId,
      [Query.equal('owner', ownerId)]
    );

    return brands.documents as IBrand[];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Update a brand
export async function updateBrand(
  brandId: string,
  brand: {
    name?: string;
    description?: string;
    logo?: File;
    banner?: File;
  }
) {
  try {
    const existingBrand = await getBrandById(brandId);
    
    // Upload logo if provided
    let logoUrl = existingBrand.logoUrl;
    if (brand.logo) {
      const uploadedLogo = await uploadFile(brand.logo);
      if (uploadedLogo) {
        logoUrl = getFilePreview(uploadedLogo.$id);
      }
    }

    // Upload banner if provided
    let bannerUrl = existingBrand.bannerUrl;
    if (brand.banner) {
      const uploadedBanner = await uploadFile(brand.banner);
      if (uploadedBanner) {
        bannerUrl = getFilePreview(uploadedBanner.$id);
      }
    }

    // Create slug from brand name if name is changed
    let slug = existingBrand.slug;
    if (brand.name && brand.name !== existingBrand.name) {
      slug = brand.name
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .replace(/\s+/g, '-');
    }

    // Update brand document
    const updatedBrand = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.brandCollectionId,
      brandId,
      {
        name: brand.name || existingBrand.name,
        slug,
        description: brand.description || existingBrand.description,
        logoUrl,
        bannerUrl,
        updatedAt: new Date().toISOString(),
      }
    );

    return updatedBrand;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Helper functions for file uploads
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000, // width
      2000, // height
      'center', // gravity
      100 // quality
    );

    return fileUrl;
  } catch (error) {
    console.error(error);
    throw error;
  }
}