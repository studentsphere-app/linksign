# Discover and Add Edusign White Label Applications

Edusign offers certain schools "white-label" applications. These applications are operated by Edusign but feature the name, logo, and colors of the school.

This guide explains how to find these applications and how to add them to the list to enrich this wrapper.

## 1. Search Application Stores

The simplest method to find these applications is to manually search application stores (App Store for iOS and Google Play Store for Android).

**What to look for:**
- Search for names of schools, campuses, or training centers.
- Look at the screenshots: Edusign white-label applications perfectly replicate the traditional interface and appearance of the official Edusign application (bottom menu organization, schedule display, large QR code scan button, etc.).
- The developer's name on the stores can sometimes be a clue ("Edusign" or the name of the school).

## 2. Capture Network Traffic to Find the Package Name

Once an application suspected of being an Edusign white label is identified, it is necessary to find its **identifier** (the package name / Bundle ID) in order to add it to the configuration.

To do this, it is recommended to use a request capture software (HTTPS proxy) such as **[Proxyman](https://proxyman.io/)** (excellent on macOS) which allows intercepting network traffic leaving a phone.

**The process:**
1. Install Proxyman on a computer and configure the SSL certificate on a phone (iOS or Android) to allow HTTPS traffic decryption.
2. Launch the white-label application on the phone.
3. Observe the outgoing requests in Proxyman.
4. Look for the initial configuration request sent to the Edusign API. It generally looks like a call to this configuration URL: 
   `https://ext.edusign.fr/v1/student/white-label/configuration/PACKAGE_NAME`
5. The **package name** (for example: `com.edusign.schoolxyz`) of the white-label application operated by Edusign can be found directly in the URL or in the request body.

## 3. Contribute: Submit a Pull Request!

When a new white-label application not present in the list is found, it is possible to contribute to the project.

If the application is not yet listed, you can open a **Pull Request** or report this white-label application to add it to the wrapper's list.

**How to do it:**
1. Fork this repository.
2. Add the application's information (the package name found previously) to the white-label configurations list (in `src/constants.ts`).
3. Submit a **Pull Request**.

Any help in listing as many of these applications as possible is greatly appreciated!
