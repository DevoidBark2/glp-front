import { Course } from "@/shared/api/course/model";
import { Card, Carousel, Col, Row, Skeleton, Grid, Divider } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { observer } from "mobx-react";
import React, { FC, useEffect, useState } from "react";
import { CourseItem } from "../CourseItem";

const { useBreakpoint } = Grid;

interface CourseCarouselProps {
    courses: Course[];
    loading: boolean;
}

export const CourseCarousel: FC<CourseCarouselProps> = observer(({ courses, loading }) => {
    const screens = useBreakpoint();
    const [isMobileCarousel, setIsMobileCarousel] = useState(false);
    const [isCarouselRequired, setIsCarouselRequired] = useState(false);

    useEffect(() => {
        setIsMobileCarousel(!screens.lg);
        setIsCarouselRequired(courses.length > 4);
    }, [screens, courses.length]);

    return (
        <div className="mb-12 mt-6">
            <h2 className="text-3xl font-semibold">
                Популярные курсы
            </h2>

            <Divider className="dark:bg-white" orientation="center" />

            <div className="mt-8">
                {loading ? (
                    <Row gutter={[16, 16]}>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <Col key={index} xs={24} sm={12} md={8} lg={6}>
                                <Card className="rounded-lg shadow-md">
                                    <div
                                        className="flex-shrink-0 w-full h-36 mr-4 bg-gray-200 rounded-lg overflow-hidden"></div>
                                    <Skeleton active paragraph={{ rows: 1 }} title style={{ marginTop: 10 }} />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : isCarouselRequired ? (
                    <Carousel
                        autoplay={false}
                        arrows
                        slidesToShow={4}
                        className="rounded-lg overflow-hidden"
                        nextArrow={<ArrowRightOutlined size={100} />} prevArrow={<ArrowLeftOutlined size={100} />}
                        responsive={[
                            {
                                breakpoint: 1300,
                                settings: { slidesToShow: 3 }
                            },
                            {
                                breakpoint: 1050,
                                settings: { slidesToShow: 2 }
                            },
                            {
                                breakpoint: 768,
                                settings: { slidesToShow: 1 }
                            },
                        ]}
                    >
                        {courses.map((course) => (
                            <div key={course.id} className="p-2">
                                <CourseItem course={course} />
                            </div>
                        ))}
                    </Carousel>
                ) : (
                    <Row gutter={[16, 16]}>
                        {courses.slice(0, 4).map((course) => (
                            <Col key={course.id} xs={24} sm={12} md={8} lg={6}>
                                <CourseItem course={course} />
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        </div>

    );
});
