import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
// import { getCollection } from './db';

// User Model
export const UserModel = {
  async create({ email, password, name, role = 'admin' }) {
    const users = await getCollection('users');
    
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await users.insertOne(user);
    return { ...user, password: undefined };
  },

  async findByEmail(email) {
    const users = await getCollection('users');
    return await users.findOne({ email });
  },

  async findById(id) {
    const users = await getCollection('users');
    return await users.findOne({ id });
  },

  async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password);
  },
};

// Product Model
export const ProductModel = {
  async create(productData) {
    const products = await getCollection('products');
    
    const product = {
      id: uuidv4(),
      ...productData,
      slug: productData.slug || this.generateSlug(productData.name),
      status: productData.status || 'published',
      featured: productData.featured || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await products.insertOne(product);
    return product;
  },

  async findAll(filters = {}) {
    const products = await getCollection('products');
    const query = {};
    
    if (filters.status) query.status = filters.status;
    if (filters.category) query.category = filters.category;
    if (filters.featured !== undefined) query.featured = filters.featured;
    
    return await products.find(query).sort({ createdAt: -1 }).toArray();
  },

  async findBySlug(slug) {
    const products = await getCollection('products');
    return await products.findOne({ slug, status: 'published' });
  },

  async findById(id) {
    const products = await getCollection('products');
    return await products.findOne({ id });
  },

  async update(id, updateData) {
    const products = await getCollection('products');
    
    const updatedProduct = {
      ...updateData,
      updatedAt: new Date(),
    };

    await products.updateOne(
      { id },
      { $set: updatedProduct }
    );

    return await this.findById(id);
  },

  async delete(id) {
    const products = await getCollection('products');
    await products.deleteOne({ id });
  },

  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  },
};

// Category Model
export const CategoryModel = {
  async create(categoryData) {
    const categories = await getCollection('categories');
    
    const category = {
      id: uuidv4(),
      ...categoryData,
      slug: categoryData.slug || this.generateSlug(categoryData.name),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await categories.insertOne(category);
    return category;
  },

  async findAll() {
    const categories = await getCollection('categories');
    return await categories.find({}).sort({ name: 1 }).toArray();
  },

  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  },
};
