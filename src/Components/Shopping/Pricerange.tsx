"use client"
interface PageProps{
    setMinPrice: any
    setMaxPrice:any
}
const Pricerange:React.FC<PageProps> = ({setMinPrice,setMaxPrice}) => {
    return (
        <div>
            <p className='text-lg font-bold mb-4'>
                Price Range
            </p>
            <div className='flex lg:flex-col gap-4 w-full'>
                <input
                    
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    type="number" placeholder='Min Price..' className='input w-full' />
                <input
                    
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    type="number" className='input w-full ' placeholder='Max Price..' />
            </div>

        </div>
    )
}

export default Pricerange