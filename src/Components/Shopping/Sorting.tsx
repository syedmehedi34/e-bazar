"use client"

interface PageProps {
    setSort: (value: string) => void
    total:number
}

const Sorting: React.FC<PageProps> = ({ setSort,total }) => {



    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-5 w-full md:w-auto relative z-[1] ">
            <p className="flex gap-1 text-sm">
                Showing <span className="font-medium">{total}</span> Result
            </p>

            <select
                className="w-full sm:w-[200px] md:w-[250px] lg:w-[300px] select dark:bg-gray-600 "
                defaultValue="latest"
                onChange={(e) => setSort(e.target.value)}
            >
                <option value="latest" className="bg-gray-200 text-black hover:bg-gray-400">Latest</option>
                <option value="older">Older</option>
                <option value="low-high">Low to High</option>
                <option value="high-low">High to Low</option>
            </select>
        </div>
    )
}

export default Sorting