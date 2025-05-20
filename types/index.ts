export interface IUser {
  $id: string;
  name: string;
  email: string;
  imageUrl: string;
  username?: string;
  bio?: string;
}

export interface IBrand {
  $id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  owner: string; // User ID
  createdAt: string;
  updatedAt: string;
}

export interface IProduct {
  $id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discountPrice?: number;
  imageUrls: string[];
  category: string;
  brand: string; // Brand ID
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IOrder {
  $id: string;
  customerId: string; // User ID
  products: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: 'card' | 'paypal' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
}