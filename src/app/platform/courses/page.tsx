"use client"
import {observer} from "mobx-react";
import {useMobxStores} from "@/stores/stores";
import React, {useEffect} from "react";
import {Spin} from "antd";

const CoursesPage = () => {

    const {courseStore} = useMobxStores();

    useEffect(() => {
       courseStore.getAllCourses().then(() => {
           courseStore.setLoadingCourses(false)
       })
    },[])

    return (
      <div className="container mx-auto">
          <h1 className="mt-6 text-3xl">Доступные курсы</h1>
          {
              !courseStore.loadingCourses ? courseStore.courses.map(course => (
                  <div key={course.id}>
                      <h1>{course.name}</h1>
                      <p>{course.teacher.name}</p>
                      <p>{course.teacher.email}</p>
                  </div>
              )): <div className="flex justify-center"><Spin size="large"/></div>
          }
      </div>
    );
}

export default observer(CoursesPage);