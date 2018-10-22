# MobileWebSpecialistND

Capstone project for Udacity's **Mobile Web Specialist Nano-Degree**, part of the **Grow with Google Scholarship**.

---

## Current State / Branch : Phase 3, Final

Rubric requirements for this stage of the project include:

* Application Data Source: The client application should pull data from the development server, parse the JSON response, and use the information to render the appropraite sections of the application UI.
* Offline Use: The client application works offline. JSON responses are cahced using the IndexedDB API. Any data previously accessed while connected is reachable while offline.


* Responsive Design: The application maintins a responsive design on mobile, tablet and desktop viewports.
* Accessibility: The application retains accessibility features from the Stage 1 project. Images have alternate text, the application uses appropriate focus management for navigation, and semantic elements and ARIA attributes are used correctly.


* Site Performance: Lighthouse targets for each category exceed
   Progressive Web App > 90
   Performance > 70
   Accessibility > 90

---

## To Run This Code:


1. Ensure that the local API Server is running on port 1337.
   The local API Server can be found [here](https://github.com/udacity/mws-restaurant-stage-2).

2. Navigate to this directory & install dependencies.
```
npm i
```

3. Start the server.
```
gulp serve
```

##### You should now be able to access the application at http://localhost:8080
