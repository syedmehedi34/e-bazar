"use client"
interface PageProps {
    setMinPrice: React.Dispatch<React.SetStateAction<number>>;
    setMaxPrice: React.Dispatch<React.SetStateAction<number>>;
}
const Pricerange:React.FC<PageProps> = ({setMinPrice,setMaxPrice}) => {
    return (
        <div>
            <p className='text-lg font-bold mb-4'>
                Price Range
            </p>
            <div className='flex lg:flex-col gap-4 w-full'>
                <input
                    
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => setMinPrice(Number(e.target.value))}
                    type="number" placeholder='Min Price..' className='input w-full dark:bg-gray-800' />
                <input
                    
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => setMaxPrice(Number(e.target.value))}
                    type="number" className='input w-full dark:bg-gray-800 ' placeholder='Max Price..' />
            </div>

        </div>
    )
}

export default Pricerange