import { useEffect, useState } from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import { BiDotsVerticalRounded } from "react-icons/bi"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import CertificateOfCompletion from "../../../assets/Images/certification_of_Completion.jpeg";

import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()

  const [enrolledCourses, setEnrolledCourses] = useState(null)
  const getEnrolledCourses = async () => {
    try {
      const res = await getUserEnrolledCourses(token);

      setEnrolledCourses(res);
    } catch (error) {
      console.log("Could not fetch enrolled courses.")
    }
  };
  useEffect(() => {
    getEnrolledCourses();
  }, [])
  const generateCertificate = (courseName) => {

    document.getElementById("student-name").innerText = `${user.firstName} ${user.lastName}`;
    document.getElementById("course-name").innerText = courseName;
    const certificateElement = document.querySelector("#certificate-template");
    console.log("element", certificateElement);
    html2canvas(certificateElement, {
      scale: 2, // Increase resolution
      useCORS: true, // Ensure cross-origin issues are handled for images
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 1.0); // Use JPEG format for stability
        const doc = new jsPDF("landscape"); // Assuming landscape layout for certificate
        doc.addImage(imgData, "JPEG", 10, 10, 270, 190); // Adjust dimensions as necessary
        doc.save(`${courseName}_Certificate.pdf`);
      })
      .catch((error) => {
        console.error("Error generating certificate:", error);
      });
  };
  return (
    <>
      <div className="text-3xl text-richblack-50">Enrolled Courses</div>
      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : !enrolledCourses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
          You have not enrolled in any course yet.
          {/* TODO: Modify this Empty State */}
        </p>
      ) : (
        <div className="my-8 text-richblack-5">
          {/* Headings */}
          <div className="flex rounded-t-lg bg-richblack-500 ">
            <p className="w-[45%] px-5 py-3">Course Name</p>
            <p className="w-1/4 px-2 py-3">Duration</p>
            <p className="flex-1 px-2 py-3">Progress</p>
          </div>
          {/* Course Names */}
          {enrolledCourses.map((course, i, arr) => (
            <div
              className={`flex items-center border border-richblack-700 ${i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
                }`}
              key={i}
            >
              <div
                className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                onClick={() => {
                  navigate(
                    `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                  )
                }}
              >
                <img
                  src={course.thumbnail}
                  alt="course_img"
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <div className="flex max-w-xs flex-col gap-2">
                  <p className="font-semibold">{course.courseName}</p>
                  <p className="text-xs text-richblack-300">
                    {course.courseDescription.length > 50
                      ? `${course.courseDescription.slice(0, 50)}...`
                      : course.courseDescription}
                  </p>
                </div>
              </div>
              <div className="w-1/4 px-2 py-3">{course?.totalDuration}</div>
              <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                <p>Progress: {course.progressPercentage || 0}%</p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="8px"
                  isLabelVisible={false}
                />
              </div>
              {course.progressPercentage === 100 && (
                <button
                  onClick={() => generateCertificate(course.courseName)}
                  className="m-2 rounded p-2 text-white bg-yellow-300"
                >
                  Download Certificate
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {/* // eslint-disable-next-line react/style-prop-object */}
      <div id="certificate-template" style={{ position: "absolute", left: "-9999px", top: 0 }} >
        <div style={{ position: "relative" }}>
          <div>
            <img src={CertificateOfCompletion} alt="certificate of competion" />
          </div>
          <div style={{ position: "absolute", top: "270px", left: "320px" }}>
            {console.log("user", user)}
            {/* /* <h2>{user.firstName } {user.lastName}</h2> */}
            <h2 id="student-name" className="font-bold text-3xl">Student Name</h2>

          </div>
          <div className="absolute bottom-[90px] left-[135px] bg-white p-[20px]">
            <h1 className="font-bold text-lg ">Krishna Gajara</h1>
          </div>
          <div className="absolute bottom-[60px] right-[135px] bg-white w-[200px] pb-3">
            <div className="flex gap-2 flex-col">
              <h1 className="font-[900]">Course Name</h1>
              <h3 id="course-name">Course Name</h3>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}