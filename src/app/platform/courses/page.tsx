"use client"
import {observer} from "mobx-react";
import {useMobxStores} from "@/stores/stores";
import React, {useEffect} from "react";
import {Divider, Input, Spin} from "antd";
import CourseDetailsModal from "@/ui/CourseDetailsModal";

const CoursesPage = () => {

    const {courseStore} = useMobxStores();

    useEffect(() => {
       courseStore.getAllCourses();
    },[])

    return (
      <div className="container mx-auto">
          <div className="flex items-center justify-between">
              <h1 className="mt-6 text-3xl mb-6">Доступные курсы</h1>
              <div className="w-1/4"><Input placeholder="Поиск..."/></div>
          </div>
          <Divider/>
          <CourseDetailsModal
              course={courseStore.selectedCourseForDetailModal!}
              openModal={courseStore.openCourseDetailsModal}
              setOpenModal={courseStore.setOpenCourseDetailsModal}
          />
          <div className="grid grid-cols-4 gap-4 mt-6">
              {
                  !courseStore.loadingCourses ? courseStore.courses?.map(course => (
                      <div key={course.id}
                           onClick={() => {
                               courseStore.setSelectedCourseForDetailModal(course);
                               courseStore.setOpenCourseDetailsModal(true);
                           }}
                           className="flex flex-col justify-between rounded-md shadow-md h-60 p-4 hover:shadow-lg transition-all hover:shadow-emerald-200 hover:cursor-pointer">
                          <div className="flex justify-between">
                              <div className="flex flex-col">
                                  <h3 className="font-bold">{course.name}</h3>
                                  <p>{course.user.first_name}</p>
                              </div>
                              <div>
                                  <img src="https://cdn.stepik.net/media/cache/images/courses/194856/cover_Sl6ky3x/2023ab5a2b085ae4307c6d4e981c7a68.png" alt={course.name} width={80} height={80}/>
                              </div>
                          </div>
                          <h4 className="font-bold text-[#00B96B]">Подробнее</h4>
                      </div>
                  )) : <div className="flex justify-center"><Spin size="large"/></div>
              }
          </div>
      </div>
    );
}

export default observer(CoursesPage);