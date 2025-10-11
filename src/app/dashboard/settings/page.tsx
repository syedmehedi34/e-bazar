"use client"
import CreateUser from '@/Components/Dashboard/Settings/CreateUser/CreateUser'
import UserList from '@/Components/Dashboard/Settings/UserList/UserList'
import Pagination from '@/Components/Pagination/Pagination'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
interface IUser {
  _id:string
  name: string,
  email: string,
  role: string[],
  createdAt: Date
}
const SettingPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [currenPage, setCurrentPage] = useState(1);
  const [pageArray, setPageArray] = useState([])
  const getUser = useCallback(async () => {
    const res = await axios.get(`https://e-bazaar-server-three.vercel.app/admin/user-list?page=${currenPage}`,{withCredentials:true});
    if (res.status === 200) {
      setUsers(res?.data?.user);
      setPageArray(res?.data?.pageArray)
    }
  }, [currenPage])

  useEffect(() => {
    getUser()
  }, [getUser])
  return (
    <div>
      <div className='grid lg:grid-cols-3 grid-cols-1 gap-5 '>
        <div className='lg:col-span-2 bg-white dark:bg-gray-800 dark:text-white py-4 rounded-box '>
          <UserList users={users} onGetUserFn = {getUser}/>

          <Pagination currentPage={currenPage} setCurrentPage={setCurrentPage} pageArray={pageArray} />
        </div>
        <div className='lg:col-span-1 bg-white dark:bg-gray-800 p-4 rounded-box '>
          <CreateUser onGetUserFn = {getUser}  />
        </div>
      </div>
    </div>
  )
}

export default SettingPage