'use client';


/*
interface ProductFormProps {
  product?: any;
  isEdit?: boolean;
}

const categories = [
  'Chandelier',
  'Pendant Light',
  'Wall Sconce',
  'Floor Lamp',
  'Table Lamp',
  'Ceiling Light',
];

export default function ProductForm({ product, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || '',
    images: product?.images?.join(', ') || '',
    status: product?.status || 'published',
    featured: product?.featured || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        images: formData.images.split(',').map((img: any) => img.trim()).filter(Boolean),
      };

      const url = isEdit ? `/api/products/${product.id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      toast({
        title: 'Success',
        description: `Product ${isEdit ? 'updated' : 'created'} successfully`,
      });

      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save product',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // return (
  //   <form onSubmit={handleSubmit} className='space-y-6'>
  //     <div className='space-y-2'>
  //       <Label htmlFor='name'>Product Name</Label>
  //       <Input
  //         id='name'
  //         value={formData.name}
  //         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
  //         required
  //       />
  //     </div>

  //     <div className='space-y-2'>
  //       <Label htmlFor='description'>Description</Label>
  //       <Textarea
  //         id='description'
  //         rows={4}
  //         value={formData.description}
  //         onChange={(e) => setFormData({ ...formData, description: e.target.value })}
  //         required
  //       />
  //     </div>

  //     <div className='grid grid-cols-2 gap-4'>
  //       <div className='space-y-2'>
  //         <Label htmlFor='price'>Price (IDR)</Label>
  //         <Input
  //           id='price'
  //           type='number'
  //           step='0.01'
  //           value={formData.price}
  //           onChange={(e) => setFormData({ ...formData, price: e.target.value })}
  //           required
  //         />
  //       </div>

  //       <div className='space-y-2'>
  //         <Label htmlFor='category'>Category</Label>
  //         <Select
  //           value={formData.category}
  //           onValueChange={(value) => setFormData({ ...formData, category: value })}
  //         >
  //           <SelectTrigger>
  //             <SelectValue placeholder='Select category' />
  //           </SelectTrigger>
  //           <SelectContent>
  //             {categories.map((cat) => (
  //               <SelectItem key={cat} value={cat}>
  //                 {cat}
  //               </SelectItem>
  //             ))}
  //           </SelectContent>
  //         </Select>
  //       </div>
  //     </div>

  //     <div className='space-y-2'>
  //       <Label htmlFor='images'>Image URLs (comma-separated)</Label>
  //       <Textarea
  //         id='images'
  //         rows={3}
  //         value={formData.images}
  //         onChange={(e) => setFormData({ ...formData, images: e.target.value })}
  //         placeholder='https://example.com/image1.jpg, https://example.com/image2.jpg'
  //       />
  //     </div>

  //     <div className='grid grid-cols-2 gap-4'>
  //       <div className='space-y-2'>
  //         <Label htmlFor='status'>Status</Label>
  //         <Select
  //           value={formData.status}
  //           onValueChange={(value) => setFormData({ ...formData, status: value })}
  //         >
  //           <SelectTrigger>
  //             <SelectValue />
  //           </SelectTrigger>
  //           <SelectContent>
  //             <SelectItem value='published'>Published</SelectItem>
  //             <SelectItem value='draft'>Draft</SelectItem>
  //           </SelectContent>
  //         </Select>
  //       </div>

  //       <div className='flex items-center space-x-2 pt-8'>
  //         <input
  //           type='checkbox'
  //           id='featured'
  //           checked={formData.featured}
  //           onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
  //           className='w-4 h-4'
  //         />
  //         <Label htmlFor='featured' className='cursor-pointer'>
  //           Featured Product
  //         </Label>
  //       </div>
  //     </div>

  //     <div className='flex gap-4'>
  //       <Button type='submit' disabled={loading}>
  //         {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
  //       </Button>
  //       <Button
  //         type='button'
  //         variant='outline'
  //         onClick={() => router.back()}
  //         disabled={loading}
  //       >
  //         Cancel
  //       </Button>
  //     </div>
  //   </form>
  // );
}
*/
