"use client"
import {observer} from "mobx-react";
import {useMobxStores} from "@/stores/stores";
import React, {useEffect, useState} from "react";
import {Divider, Input} from "antd";

const CoursesPage = () => {

    const {courseStore} = useMobxStores();
    const [courses,setCourses] = useState([
        {id:1,name: "Курс по HTTP",teacher:"Антон Павлов",image: "https://cdn.stepik.net/media/cache/images/courses/194856/cover_Sl6ky3x/2023ab5a2b085ae4307c6d4e981c7a68.png"},
        {id:2,name: "Основы Git",teacher:"Антон Павлов",image: "https://cdn.stepik.net/media/cache/images/courses/209332/cover_cjIaSHi/e9e434520794bea97ed380fde0e85120.jpg"},
        {id:3,name: "Основы Docker",teacher:"Антон Павлов",image: "https://cdn.stepik.net/media/cache/images/courses/209011/cover_TQIpD67/5e6923c0a7897393e2842fef8865abf7.jpg"},
        {id:4,name: "Основы Docker",teacher:"Антон Павлов",image: "https://cdn.stepik.net/media/cache/images/courses/209011/cover_TQIpD67/5e6923c0a7897393e2842fef8865abf7.jpg"},
    ])

    useEffect(() => {
       // courseStore.getAllCourses().then(() => {
       //     courseStore.setLoadingCourses(false)
       // })
    },[])

    return (
      <div className="container mx-auto">
          <div className="flex items-center justify-between">
              <h1 className="mt-6 text-3xl mb-6">Доступные курсы</h1>
              <div className="w-1/4"><Input placeholder="Поиск..."/></div>
          </div>
          <Divider/>
          {/*{*/}
          {/*    !courseStore.loadingCourses ? courseStore.courses.map(course => (*/}
          {/*        <div key={course.id}>*/}
          {/*            <h1>{course.name}</h1>*/}
          {/*            <p>{course.teacher.name}</p>*/}
          {/*            <p>{course.teacher.email}</p>*/}
          {/*        </div>*/}
          {/*    )): <div className="flex justify-center"><Spin size="large"/></div>*/}
          {/*}*/}
          <div className="grid grid-cols-4 gap-4 mt-6">
              {
                  courses.map(course => (
                      <div key={course.id}
                           className="flex flex-col justify-between rounded-md shadow-md h-60 p-4 hover:shadow-lg transition-all hover:shadow-emerald-200 hover:cursor-pointer">
                          <div className="flex justify-between">
                              <div className="flex flex-col">
                                  <h3 className="font-bold">{course.name}</h3>
                                  <p>{course.teacher}</p>
                              </div>
                              <div>
                                  <img src={course.image} alt={course.name} width={50} height={50}/>
                              </div>
                          </div>
                          <h4 className="font-bold text-[#00B96B]">Начать</h4>
                      </div>
                  ))
              }
          </div>
      </div>
    );
}

export default observer(CoursesPage);