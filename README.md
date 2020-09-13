# Orthanc Tools JS

![Node.js CI](https://github.com/salimkanoun/Orthanc-Tools-JS/workflows/Node.js%20CI/badge.svg)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/salimkanoun/Orthanc-Tools-JS.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/salimkanoun/Orthanc-Tools-JS/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/salimkanoun/Orthanc-Tools-JS.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/salimkanoun/Orthanc-Tools-JS/context:javascript)
[![dependencies Status](https://david-dm.org/salimkanoun/Orthanc-Tools-JS/status.svg?path=BackEnd)](https://david-dm.org/salimkanoun/Orthanc-Tools-JS?path=BackEnd)
[![devDependencies Status](https://david-dm.org/salimkanoun/Orthanc-Tools-JS/dev-status.svg?path=BackEnd)](https://david-dm.org/salimkanoun/Orthanc-Tools-JS?path=BackEnd&type=dev)


Rewriting of Orthanc Tools in React and NodeJS.

Orthanc Tools JS is mainly a React Frontend for the powerfull Orthanc APIs but also include a Backend for authentication purpose, role management and automation.

Warning : Orthanc Tools JS is still in beta version, this software is not release ready

Current Features : 
  - Users identifications local and Active directory with definitions of roles (custom rigth access to orthanc Apis)
  - Search ressources in Orthanc
  - Import DICOM file into Orthanc using drag and drop
  - Batch Anonymizaion
  - Batch Export (local ZIP, AET, Orthanc Peers)
  - Batch Delete
  - Manual Query and Retrieve
  - Dicom Tag Edition
  - Automatic Retrieve : Define a list of studies /Series to retrieve and schedule a robot for automatic retrieval
  - CD Burner Management (Epson and Primera) (Beta)
  - Administration panel : Declaration and echo of AETs, Orthanc Peers, Jobs management

Roadmap : 
Export to external endpoint : FTP / SFTP / WebDav
Monitoring  : Tag collection (in Elastic Search), Prefecthing, AutoRouting
