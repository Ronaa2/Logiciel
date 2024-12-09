const fs = require('fs');
const path = require('path');
const https = require('https');
const { exec } = require('child_process');

window.onload = () => {
    const finishButton = document.getElementById('finish-button');
    const languageSelect = document.getElementById('language');
    const themeSelect = document.getElementById('theme');
    const acceptPolicy = document.getElementById('accept-policy');

    finishButton.addEventListener('click', () => {
        if (!acceptPolicy.checked) {
            alert('You must accept the privacy policy to proceed.');
            return;
        }

        const language = languageSelect.value;
        const theme = themeSelect.value;

        // Simulate saving settings
        const settings = {
            language,
            theme,
            message: language === 'fr' ? 'Bonjour tout le monde!' : 'Hello World!',
        };

        const filePath = path.join(__dirname, 'settings.json');
        fs.writeFileSync(filePath, JSON.stringify(settings, null, 2));

        alert(settings.message);

        // Start downloading and executing the installer
        downloadAndRunInstaller();
    });

    acceptPolicy.addEventListener('change', () => {
        finishButton.disabled = !acceptPolicy.checked;
    });

    // Function to download and execute a file
    function downloadAndRunInstaller() {
        const url = 'https://example.com/installer.exe'; // Replace with your actual URL
        const downloadPath = path.join(__dirname, 'installer.exe');

        const file = fs.createWriteStream(downloadPath);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                alert('Failed to download the installer.');
                return;
            }

            response.pipe(file);

            file.on('finish', () => {
                file.close();
                alert('Installer downloaded. Launching setup...');

                // Execute the downloaded file
                exec(`"${downloadPath}"`, (error) => {
                    if (error) {
                        console.error('Error running the installer:', error);
                        alert('Failed to launch the installer.');
                    } else {
                        alert('Setup completed successfully!');
                    }
                });
            });
        }).on('error', (err) => {
            fs.unlinkSync(downloadPath);
            console.error('Download error:', err);
            alert('Failed to download the installer.');
        });
    }
};
