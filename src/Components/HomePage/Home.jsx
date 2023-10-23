import { useEffect, useState } from "react";
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  updateProfile,
  getProviderId,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "../Confige/FirebaseConfige/Firebase.comfige";
import { loadAuth2, loadGapiInsideDOM } from "gapi-script";
import gapi from "gapi-client";

const provider = new GoogleAuthProvider();

const config = {
  apiKey: "AIzaSyDHL0um5M2WV0FfEYbLOmF3Ur6iGg6yL1E",
  authDomain: "fir-authcalendertest-4ca25.firebaseapp.com",
  projectId: "fir-authcalendertest-4ca25",
  storageBucket: "fir-authcalendertest-4ca25.appspot.com",
  messagingSenderId: "425482410306",
  appId: "1:425482410306:web:98fe0b929bdad7f5bcd0db",
  measurementId: "G-4BHZBJ156F",
  clientId:
    "425482410306-6cu5hnedobqe24gedavmiikv8cec6fet.apps.googleusercontent.com",
  scopes: ["email", "profile", "https://www.googleapis.com/auth/calendar"],
  discoveryDocs: [
    "https://calendar-json.googleapis.com/$discovery/rest?version=v3",
  ],
};

const Home = () => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [googleCalenderActionUrl, setGoogleCalenderActionUrl] = useState("");
  const [gapiUser, setGapiUser] = useState(null);

  const handelSingInUser = (e) => {
    e.preventDefault();
    const from = e.target;
    const name = from.name.value;
    const email = from.email.value;
    const password = from.password.value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(userCredential, "userCredential");
        if (user) {
          user
            .getIdToken()
            .then((idToken) => {
              if (idToken) {
                console.log("Firebase ID Token:", idToken);
                fetch("http://localhost:5000/verifyIdToken", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    idtoken: idToken,
                  },
                })
                  .then((res) => res.json())
                  .then((data) => console.log(data));
              }

              updateProfile(auth.currentUser, {
                displayName: name,
              })
                .then((result) => {})
                .catch((error) => {});
            })
            .catch((error) => {
              console.error("Error getting Firebase ID token:", error);
            });
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // Handle Firebase sign-in error
      });
  };

  // const handelSingInUser = (e) => {
  //   e.preventDefault();
  //   const from = e.target;
  //   const name = from.name.value;
  //   const email = from.email.value;
  //   const password = from.password.value;

  //   createUserWithEmailAndPassword(auth, email, password)
  //     .then((userCredential) => {
  //       const user = userCredential.user;
  //       console.log(userCredential, "userCredential");
  //       if (user) {
  //         user
  //           .getIdToken()
  //           .then((idToken) => {
  //             console.log("Firebase ID Token:", idToken);

  //             updateProfile(auth.currentUser, {
  //               displayName: name,
  //             }).catch((error) => {
  //               console.error(
  //                 "Error exchanging ID token for access token:",
  //                 error
  //               );
  //             });
  //           })
  //           .catch((error) => {
  //             console.error("Error getting Firebase ID token:", error);
  //           });
  //       }
  //     })
  //     .catch((error) => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       // ..
  //     });
  // };

  // const handleSignInUser = (e) => {
  //   e.preventDefault();
  //   const form = e.target;
  //   const name = form.name.value;
  //   const email = form.email.value;
  //   const password = form.password.value;

  //   createUserWithEmailAndPassword(auth, email, password)
  //     .then((userCredential) => {
  //       const user = userCredential.user;

  //       if (user) {
  //         // Now, sign in with Google using gapi
  //         gapi.auth2
  //           .getAuthInstance()
  //           .signIn()
  //           .then((googleUser) => {
  //             // You can get the Google access token from the Google user
  //             const googleAccessToken =
  //               googleUser.getAuthResponse().access_token;
  //             console.log("Google Access Token:", googleAccessToken);
  //             console.log("Google googleUser:", googleUser);

  //             // Update Firebase user profile
  //             updateProfile(user, {
  //               displayName: name,
  //             })
  //               .then(() => {
  //                 // User profile updated
  //               })
  //               .catch((error) => {
  //                 console.error("Error updating Firebase profile:", error);
  //               });
  //           })
  //           .catch((error) => {
  //             console.error("Error signing in with Google:", error);
  //           });
  //       }
  //     })
  //     .catch((error) => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       // Handle Firebase sign-in error
  //       console.error("Firebase Sign-In Error:", errorMessage);
  //     });
  // };

  useEffect(() => {
    //On load, called to load the auth2 library and API client library.
    gapi.load("client:auth2", initClient);
  }, []);

  // Initialize the API client library
  function initClient() {
    gapi.client
      .init({
        apiKey: "AIzaSyDHL0um5M2WV0FfEYbLOmF3Ur6iGg6yL1E",
        clientId:
          "425482410306-asnbvvqtnla6is476kggpufbvift5i8c.apps.googleusercontent.com",
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
        ],
        scope: "https://www.googleapis.com/auth/calendar",
      })
      .then(() => {
        // do stuff with loaded APIs
        console.log("it worked");
      })
      .catch((error) => console.log(error));
  }
  // useEffect(() => {
  //   const loadGapi = async () => {
  //     const gapi = await loadGapiInsideDOM();
  //     let auth2 = await loadAuth2(
  //       gapi,
  //       "425482410306-6cu5hnedobqe24gedavmiikv8cec6fet.apps.googleusercontent.com",
  //       "https://www.googleapis.com/auth/calendar"
  //     );
  //     console.log(auth2);
  //   };
  //   loadGapi();
  // }, []);

  // Firebase user tracking function
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseCurrentUser) => {
      // console.log(firebaseCurrentUser, "firebaseCurrentUser");
      setFirebaseUser(firebaseCurrentUser);
    });

    return () => unsubscribe();
  }, []);

  const singOutUser = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("credentialUser");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  // gapi.client.calendar.events.list({
  //   'calendarId': 'primary',
  //   'timeMin': (new Date()).toISOString(),
  //   'showDeleted': false,
  //   'singleEvents': true,
  //   'maxResults': 10,
  //   'orderBy': 'startTime',
  // }).then((response) => {
  //   const events = response.result.items;
  //   if (events.length > 0) {
  //     for (let i = 0; i < events.length; i++) {
  //       const event = events[i];
  //       console.log(event.summary);
  //     }
  //   } else {
  //     console.log('No upcoming events found.');
  //   }
  // });

  return (
    <div>
      <div>
        {!firebaseUser && (
          <div className="flex justify-center items-center h-[100vh] overflow-hidden">
            <form
              className="w-[400px] mx-auto bg-gray-600 p-5 rounded-md mb-20"
              onSubmit={handelSingInUser}
              // onSubmit={handleSignInUser}
            >
              <div>
                <input
                  type="name"
                  placeholder="Type name"
                  name="name"
                  className="input input-bordered input-primary w-full my-3"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Type email"
                  name="email"
                  className="input input-bordered input-primary w-full my-3"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Type Password"
                  name="password"
                  className="input input-bordered input-primary w-full my-3"
                />
              </div>
              <div className="flex justify-start items-center mt-4">
                <button type="submit" className="btn btn-secondary">
                  SignIn
                </button>
              </div>
            </form>
          </div>
        )}
        {firebaseUser && <button onClick={singOutUser}>singOut</button>}
      </div>
    </div>
  );
};
export default Home;
