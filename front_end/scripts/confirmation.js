
document.addEventListener('DOMContentLoaded', (event) => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const date = urlParams.get('date');

    // Format the date
    const formattedDate = new Date(date).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Set the text content of the spans
    document.getElementById('name').textContent = name;
    document.getElementById('date').textContent = formattedDate;
});

function goBack() {
    window.history.back();
}