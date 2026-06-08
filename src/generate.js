import { encodeName } from "./encode.js";

const form = document.getElementById("gen-form");
const input = document.getElementById("gen-name");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = input.value.trim();
  const base = import.meta.env.BASE_URL; // "/"
  const url = name ? `${base}?g=${encodeName(name)}` : base;
  window.location.assign(url); // redirect to the home invitation
});
