import axios from 'axios';

async function testApi() {
    try {
        const response = await axios.get('https://www.goldapi.io/api/XAU/INR', {
            headers: {
                'x-access-token': 'sk_382f524d12f195832ACc8e9C186C79127F2833DfaF1A7DcD'
            }
        });
        console.log("Success:", response.data);
    } catch (e) {
        console.error("Error:", e.response ? e.response.data : e.message);
    }
}

testApi();
