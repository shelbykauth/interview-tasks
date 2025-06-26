/**
 * @author Shelby Kauth
 * @description Non-blocking popup script for Termaggedon's hiring process
 * @version 0.0.0
 * @license AGPL-3.0
 * This script creates a non-blocking popup
 * It is designed to be injected into a webpage
 * It will not block the page from loading or interacting with it
 * (a native alert or dialog would block other interactions and potentially break the page)
 *
 * @usage `<script defer src="https://shelbykauth.github.io/interview-tasks/termaggedon/non-blocking-popup.js" />`
 */

(() => {
  // encapsulate the code in an IIFE to avoid polluting the global namespace
  // and to ensure the code runs in the correct context
  "use strict";
  function CreateNonBlockingPopup() {
    // I could use `new CSSStyleSheet()` here, but that's not supported in all browsers.
    // Using webpack, React, or other frameworks would allow for better encapsulation and styling, with cleaner code.
    // However, this is a simple script that doesn't require such complexity.

    const shadowHost = document.createElement("div");
    shadowHost.style = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: none;
      z-index: 9999;
      pointer-events: none;
    `;

    // Shaow DOM is supported by 95% of browsers, and can be polyfilled for older browsers.
    // This allows us to create styles that do not interfere with the page's existing styles,
    // and to create a popup that is not blocked by the page's existing styles.

    const shadow = shadowHost.attachShadow({ mode: "open" });
    shadow.id = "non_blocking_popup_shadow_root";
    let shadowStyle = document.createElement("style");
    shadowStyle.textContent = `
      #non_blocking_popup, #yes_popup, #no_popup {
        position: absolute;
        bottom: 50px;
        left: 50px;
        max-width: 30em;
        background-color: white;
        font-size: 18px;
        color: black;
        box-shadow: 0 4px 8px rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        border: 1px solid black;
        padding: 20px;
        z-index: 1000;
        pointer-events: auto;
        text-align: center;
      }
      .hidden {
        display: none;
      }
      h1 {
        margin: 0;
        font-size: 30px;
      }
      p {
        margin: 10px 0;
      }
      p.buttons {
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-direction: column;
        align-items: flex-end;
        margin: 0;
      }
      button.easy {
        color: white;
        background-color: #007bff; /* Bootstrap primary color - blue for trust */
        border-radius: 8px;
        border: none;
        box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);
        font-size: 36px;
        padding: 10px 20px;
        cursor: pointer;
        font-weight: bold;
      }
      button.hard {
        color: #888;
        background: none;
        border: none;
        text-decoration: underline;
      }
      button.easyish {
        color: #007bff;
        background: none;
        border: none;
        text-decoration: underline;
      }
      form {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 10px;
      }
      form input[type="checkbox"] {
        margin: 0 10px;
        float: right;
        height: 27px;
      }
    `;

    shadow.appendChild(shadowStyle);

    const mailtoLink = `<a _target="blank" rel="noopener" href='mailto:shelbykauth@gmail.com'>ShelbyKauth@gmail.com</a>`;

    const initialPopup = document.createElement("div");
    initialPopup.id = "non_blocking_popup";
    initialPopup.innerHTML = `
      <h1>Do you want to hire Shelby&nbsp;Kauth?</h1>
      <p>${mailtoLink}</p>
      <p class=buttons>
        <button class="easy" id="hire_candidate_yes">OK</button>
        <button class="hard" id="hire_candidate_no">consider other candidates</button>
      </p>
    `;
    const YesPopup = document.createElement("div");
    YesPopup.id = "yes_popup";
    YesPopup.innerHTML = `
      <h1>Thank you for considering Shelby&nbsp;Kauth!</h1>
      <p>We appreciate your interest in hiring Shelby&nbsp;Kauth.</p>
      <p>Let her know at ${mailtoLink}.</p>
      <button class="easy" id="hire_candidate_confirm_yes">Will Do!</button>
    `;
    YesPopup.classList.add("hidden");

    const NoPopup = document.createElement("div");
    NoPopup.id = "no_popup";
    NoPopup.innerHTML = `
      <h1>That's too bad!</h1>
      <p>We regretfully inform ourselves that we're taking some time to consider other candidates.</p>
      <hr />
      <form>
        <label>Keep Shelby On File For Future Openings<input type="checkbox" checked disabled></label>
        <label>Hire Shelby Immediately<input type="checkbox" checked ></label>
        <label>Interview Shelby Immediately<input type="checkbox" checked ></label>
        <label>Consider Shelby for Interview<input type="checkbox" checked ></label>
      </form>
      <button class="hard" id="reject_candidate_confirm_no">OK</button>
      <button class="easyish" id="reject_candidate_go_back">Wait No!</button>
    `;
    NoPopup.classList.add("hidden");

    shadow.appendChild(initialPopup);
    shadow.appendChild(NoPopup);
    shadow.appendChild(YesPopup);

    // Add event listeners to the buttons

    shadow
      .querySelector("#hire_candidate_yes")
      ?.addEventListener("click", () => {
        initialPopup.classList.add("hidden");
        YesPopup.classList.remove("hidden");
      });
    shadow
      .querySelector("#hire_candidate_no")
      ?.addEventListener("click", () => {
        initialPopup.classList.add("hidden");
        NoPopup.classList.remove("hidden");
      });
    shadow
      .querySelector("#hire_candidate_confirm_yes")
      ?.addEventListener("click", () => {
        YesPopup.classList.add("hidden");
      });
    shadow
      .querySelector("#reject_candidate_confirm_no")
      ?.addEventListener("click", () => {
        NoPopup.classList.add("hidden");
      });
    shadow
      .querySelector("#reject_candidate_go_back")
      ?.addEventListener("click", () => {
        NoPopup.classList.add("hidden");
        initialPopup.classList.remove("hidden");
      });

    // Append the shadow host to the body after a short delay to ensure the body is not erased
    setTimeout(() => {
      document.body.appendChild(shadowHost);
    }, 100); // Show after .1 seconds
  }

  // Do not append the popup until the DOM is fully loaded.
  if (document.readyState !== "loading") {
    CreateNonBlockingPopup();
  } else {
    document.addEventListener("DOMContentLoaded", CreateNonBlockingPopup);
  }
})();
