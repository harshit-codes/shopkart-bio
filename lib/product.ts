import { ID, Query } from 'appwrite';
import { appwriteConfig, databases } from './appwrite';
import { IProduct } from '@/types';
import { getFilePreview, uploadFile } from './brand';

// Create a new product
export async function createProduct(product: {
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  images?: File[];
  category: string;
  brand: string;
  stock: number;
}) {
  try {
    // Upload images if provided
    const imageUrls: string[] = [];
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        const uploadedImage = await uploadFile(image);
        if (uploadedImage) {
          imageUrls.push(getFilePreview(uploadedImage.$id));
        }
      }
    }

    // Create slug from product name
    const slug = product.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-');

    // Create product document
    const newProduct = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productCollectionId,
      ID.unique(),
      {
        name: product.name,
        slug,
        description: product.description || '',
        price: product.price,
        discountPrice: product.discountPrice || null,
        imageUrls,
        category: product.category,
        brand: product.brand,
        stock: product.stock,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );

    return newProduct;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Get a product by ID
export async function getProductById(productId: string) {
  try {
    const product = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productCollectionId,
      productId
    );

    return product;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Get a product by slug
export async function getProductBySlug(slug: string) {
  try {
    const products = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.productCollectionId,
      [Query.equal('slug', slug)]
    );

    if (products.documents.length === 0) {
      throw new Error('Product not found');
    }

    return products.documents[0] as IProduct;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Get products by brand
export async function getProductsByBrand(brandId: string) {
  try {
    const products = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.productCollectionId,
      [Query.equal('brand', brandId)]
    );

    return products.documents as IProduct[];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Get products by category
export async function getProductsByCategory(category: string) {
  try {
    const products = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.productCollectionId,
      [Query.equal('category', category)]
    );

    return products.documents as IProduct[];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Update a product
export async function updateProduct(
  productId: string,
  product: {
    name?: string;
    description?: string;
    price?: number;
    discountPrice?: number | null;
    images?: File[];
    category?: string;
    stock?: number;
    isActive?: boolean;
  }
) {
  try {
    const existingProduct = await getProductById(productId);
    
    // Upload images if provided
    let imageUrls = existingProduct.imageUrls || [];
    if (product.images && product.images.length > 0) {
      imageUrls = []; // Replace existing images
      for (const image of product.images) {
        const uploadedImage = await uploadFile(image);
        if (uploadedImage) {
          imageUrls.push(getFilePreview(uploadedImage.$id));
        }
      }
    }

    // Create slug from product name if name is changed
    let slug = existingProduct.slug;
    if (product.name && product.name !== existingProduct.name) {
      slug = product.name
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .replace(/\s+/g, '-');
    }

    // Update product document
    const updatedProduct = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productCollectionId,
      productId,
      {
        name: product.name || existingProduct.name,
        slug,
        description: product.description !== undefined ? product.description : existingProduct.description,
        price: product.price !== undefined ? product.price : existingProduct.price,
        discountPrice: product.discountPrice !== undefined ? product.discountPrice : existingProduct.discountPrice,
        imageUrls,
        category: product.category || existingProduct.category,
        stock: product.stock !== undefined ? product.stock : existingProduct.stock,
        isActive: product.isActive !== undefined ? product.isActive : existingProduct.isActive,
        updatedAt: new Date().toISOString(),
      }
    );

    return updatedProduct;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Delete a product
export async function deleteProduct(productId: string) {
  try {
    const result = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productCollectionId,
      productId
    );

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}