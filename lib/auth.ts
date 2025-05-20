import { ID, Query } from 'appwrite';
import { account, appwriteConfig, avatars, databases } from './appwrite';
import { IUser } from '@/types';

// SignUp
export async function createUserAccount(user: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    // Create a new account in Appwrite
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    // Get user avatar
    const avatarUrl = avatars.getInitials(user.name);

    // Create user document in database
    const newUser = await saveUserToDB({
      $id: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      imageUrl: avatarUrl,
      username: user.email.split('@')[0],
    });

    return newUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Save user to database
export async function saveUserToDB(user: IUser) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Sign In
export async function signInAccount(user: {
  email: string;
  password: string;
}) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('$id', currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Sign Out
export async function signOutAccount() {
  try {
    const session = await account.deleteSession('current');
    return session;
  } catch (error) {
    console.error(error);
    throw error;
  }
}