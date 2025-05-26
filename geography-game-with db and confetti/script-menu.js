// Simple script for basic interactions
document.addEventListener('DOMContentLoaded', () => {
   // Notification button effect
   const notification = document.querySelector('.notification');
   if (notification) {
       notification.addEventListener('click', () => {
           notification.innerHTML = '<span>✅</span> Subscribed!';
           notification.style.backgroundColor = '#e3f9e5';
           notification.style.borderColor = '#a3e9a4';
           
           // Reset after 3 seconds
           setTimeout(() => {
               notification.innerHTML = '<span>📬</span> Get updates';
               notification.style.backgroundColor = '';
               notification.style.borderColor = '';
           }, 3000);
       });
   }
   
   // Simple hover effect for logo
   const logoContainer = document.querySelector('.logo-container');
   if (logoContainer) {
       logoContainer.addEventListener('mouseover', () => {
           const logoDeco = document.querySelector('.logo-decoration');
           logoDeco.style.height = '12px';
       });
       
       logoContainer.addEventListener('mouseout', () => {
           const logoDeco = document.querySelector('.logo-decoration');
           logoDeco.style.height = '8px';
       });
   }
});