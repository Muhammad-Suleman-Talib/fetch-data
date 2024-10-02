'use client'
import Link from 'next/link'
import React,{useEffect, useState} from 'react'
interface typess{
    id?:number
    title:string
    description:string
    price:number
    category:string
    image:string
}
export default function Productpage() {
    useEffect(()=>{
        alldatafetch()
    },[])
    const [product,setproduct] = useState<typess[]>([]);
    const [productform,setproduvtform] = useState<typess>({
        title:'',
        image:'',
        description:'',
        price:0,
        category:''

    })
    const [currentid,setcurrentid] = useState<Number|null>(null);
    const [editing,setisediting] = useState(false);
    const [message,setmessage] =  useState('');


    const handleformchange = (e:any) =>{
        setproduvtform({
            ...productform,
            [e.target.name]:  e.target.value
        })
    }
    const resetform = () =>{
        setproduvtform({title:'',price:0,category:'',image:'',description:''});
        setisediting(false);
        setcurrentid(null)
    }
   
    const alldatafetch = async ()=>{
        try {
            const response = await fetch('https://fakestoreapi.com/products');
            const data = await response.json();
            setproduct(data)
        } catch (error) {
            console.log('Failed to fetch data',error);
            
        }
    }

    const addproduct = async() =>{
        try {
        const response =   await fetch('https://fakestoreapi.com/products',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(productform)
        });
        const data = await response.json();
        setproduct((prevpro)=> [...prevpro,data])
        setmessage('Product Added Successfully!');
        resetform();

        } catch (error) {
          console.log('Failed to add product  ');
            setmessage('Failed to Add product  ')
        }
    }

    const editProduct = async () =>{
        if(currentid === null) return;
        try {
            const response = await fetch(`https://fakestoreapi.com/products/${currentid}`,{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(productform)
            })

            const updateddata = await response.json();
            setproduct((prevproduct)=> prevproduct.map((product)=> product.id === currentid ? updateddata :product));
            setmessage('Product Updated Successfully!')
            resetform()
            
        } catch (error) {
            console.log('Failed to product Updated',error);
            setmessage('Failed to product Updated')
            
        }
    }

    const deleteProduct = async (id:number) =>{
        try {
            await fetch('https://fakestoreapi.com/products',{
                method:'DELETE',

            });
            setproduct((prev)=> prev.filter((product)=>product.id !== id  ))

        } catch (error) {
            console.log('Failed to Delete Product');
            setmessage('Failed to delete product')
            
        }
    }

    const startediting = (product:typess) =>{
        setproduvtform(product)
        setisediting(true)
        setcurrentid(product.id ||null)
    }
    const handlesubmit = (e:any) =>{
        e.preventDefault();
        if (editing) {
            editProduct();
        }else{
            addproduct();
        }
    }
    
    return (
        <div className="container mx-auto p-5 ">
        <h1 className='text-2xl font-bold mb-5'>Product Management</h1>
        <form onSubmit={handlesubmit} className="max-w-md mx-auto p-4 border border-gray-300 rounded">
            <h2 className='text-xl font-semibold mb-3'>{editing ? 'Edit product':'Add new Product'}</h2>
            <h2 className="text-lg font-bold mb-4">Add Product</h2>
            <div className="mb-4">
                <label className="block mb-1">Title:</label>
                <input
                    type="text"
                    name='title'
                    value={productform.title}
                   onChange={handleformchange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Category:</label>
                <input
                    type="text"
                    name='category'
                    value={productform.category}
                    onChange={handleformchange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Price:</label>
                <input
                    type="number"
                    name='price'
                    value={productform.price}
                    onChange={handleformchange}
                   
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    name='image'
                    placeholder="Image URL"
                    value={productform.image}
                    onChange={handleformchange}
                    
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Description:</label>
                <textarea
                    name='description'
                    value={productform.description}
                   onChange={handleformchange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
                {editing ? 'Update Product':'Add product'}
            </button>
            
        </form>
        
        {message && <p className="text-2xl font-bold text-indigo-500">{message}</p>}
{product.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
    {product.map((pro) => {
      return (
        <div 
          key={pro.id} 
          className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300 p-4 max-w-xs h-96 flex flex-col justify-between"
        >
          <div className="h-48 w-full">
            <img 
              src={pro.image} 
              alt={pro.title} 
              className="w-full h-full object-contain object-center"
            />
          </div>
          <div className="p-2">
            <p className="font-bold text-sm">Title: {pro.title}</p>
            <p className="text-gray-600 text-sm">Price: ${pro.price}</p>
            <p className="text-gray-600 text-xs truncate">Description: {pro.description}</p>
            <p className="text-gray-600 text-xs">Category: {pro.category}</p>
          </div>
          <div className="flex justify-between mt-2">
            <button 
              className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 text-sm"
              onClick={() => startediting(pro)}
            >
              <Link href='/'>Edit</Link>
            </button>
            <button 
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 text-sm"
              onClick={() => deleteProduct(pro.id || 0)}
            >
              Delete
            </button>
          </div>
        </div>
      );
    })}
  </div>
) : (
  <p className="text-xl font-bold text-red-500">Loading Product from DataBase .........</p>
)}


    </div>
    );
    
}
