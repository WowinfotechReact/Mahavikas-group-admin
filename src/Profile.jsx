import React, { useContext, useEffect, useState } from 'react';
import { Tooltip } from '@mui/material';
import EmployeeProfileModal from 'component/EmployeeProfileModal';
import { GetEmployeeModel } from 'services/Employee Staff/EmployeeApi';
import { ConfigContext } from 'context/ConfigContext';
import { useLocation } from 'react-router';
import dayjs from 'dayjs';

const Profile = () => {
  const [showEmployeeProfile, setShowEmployeeProfile] = React.useState(false);
  const { setLoader, user } = useContext(ConfigContext);
  const [imageUrl, setImageUrl] = useState("");
  console.log(user, 'dsaoudasdas');

  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        const topics = ['electric wire', 'cable', , 'electricity',
          // 'Pac'
        ]; // Themed keywords
        const randomTopic = topics[Math.floor(Math.random() * topics.length)]; // Pick a random topic

        const response = await fetch(
          `https://api.unsplash.com/photos/random?query=${randomTopic}&client_id=V1RL5cJTBP2CUkQg1YuxetBUtUBBASHW1arSY_Tn8K4`
        );
        const data = await response.json();
        setImageUrl(data.urls?.regular); // Set the image URL
      } catch (error) {
        console.error("Error fetching the image:", error);
      }
    };

    fetchRandomImage();
  }, []);


  const [employeeObj, setEmployeeObj] = useState({
    name: null,
    address: null,
    aadharNo: null,
    userKeyID: null,
    employeeKeyID: null,
    companyID: null,
    profileImageURL: null,
    birthDate: null,
    mobileNo: null,
    emailID: null,
    seniorID: null,
    adharNumber: null,
    panNumber: null,
    bankAccountNumber: null,
    ifsc: null,
    higherAuthorityID: null,
    roleTypeID: null,
    userName: '',
    password: null
  });





  return (
    <>
      <div className="card container-fluid">
        <div className="row g-0 d-flex flex-column">
          {/* Image Section (Moved to Top) */}
          <div
            className="col-12 gradient-custom text-white position-relative"
            style={{
              borderTopLeftRadius: "0.2rem",
              borderTopRightRadius: "0.2rem",
              overflow: "hidden",
              height: "300px", // Adjust height as needed
            }}
          >
            {/* Background Image with Low Opacity */}
            {imageUrl && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.5, // Adjust opacity level
                  zIndex: 0,
                }}
              />
            )}

            {/* Profile Image and Details at Bottom Corner */}
            <div
              style={{
                position: "absolute",
                bottom: "20px", // Adjust distance from bottom
                left: "20px", // Adjust distance from left (use "right" for bottom-right corner)
                zIndex: 1,
                display: "flex",
                alignItems: "flex-end", // Align items to the bottom
                gap: "10px", // Space between image and text
              }}
            >


              {/* Name and Admin Text */}
              <div>
                <h5 style={{ margin: 0 }}>{user.employeeName}</h5>
                <p style={{ margin: 0 }}>  {user.roleTypeID === 1 && "Super Admin"}
                  {user.roleTypeID === 2 && "Admin"}
                  {user.roleTypeID === 3 && "CRM"}
                  {user.roleTypeID === 4 && "Store"}
                  {user.roleTypeID === 5 && "Accountant"}</p>
              </div>
            </div>

            {/* Edit Profile Button */}

          </div>

          {/* Information Section (Moved to Bottom) */}
          <div className="col-12">
            <div className="p-3">
              <h6>Personal Information</h6>
              <hr className="mt-0 mb-1" />
              <div className="row pt-1">
                <div className="col-6 mb-1">
                  <h6>User Name</h6>
                  <p className="text-muted">{user.employeeName}</p>
                </div>
                <div className="col-6 mb-3">
                  <h6>Date of Birth</h6>
                  <p className="text-muted">

                    {user.dateOfBirth ? dayjs(user.dateOfBirth).format('DD/MM/YYYY') : '-'}

                  </p>
                </div>
                <div className="col-6 mb-3">
                  <h6>Contact Number</h6>
                  <p className="text-muted">{user.mobileNumber}</p>
                </div>
                <div className="col-6 mb-3">
                  <h6>Email</h6>
                  <p className="text-muted">{user.emailID}</p>
                </div>
                <div className="col-6 mb-3">
                  <h6>Aadhaar Card </h6>
                  <p className="text-muted">{user.aadhaarNumber}</p>
                </div>
                <div className="col-6 mb-3">
                  <h6>Address</h6>
                  <p className="text-muted">{user.address}</p>
                </div>
              </div>




            </div>
          </div>
        </div>

        {/* Modal Section */}

      </div>

    </>
  );
};

export default Profile;
