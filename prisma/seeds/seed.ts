import 'dotenv/config';
import axios from 'axios'; // ติดตั้ง axios ด้วย npm install axios

async function seed() {
    try {
        //test create user
        const response = await axios.post(`${process.env.API_BASE_URL}/auth/register`, {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john2.doe@example.com",
            "password": "P@ssw0rd123",
            "phone": "+12345678901",
            "date_of_birth": "1990-01-15"
        });
        const user = response.data.user;
        console.log('User created:', user);
        const token = response.data.accessToken; // Assuming the token is returned in the response
        //test create another wallet
        const walletResponse = await axios.post(
            `${process.env.API_BASE_URL}/wallets/create`,
            {
                "name": "test2 wallet",
                "description": "test2",
                "wallet_type": "savings"
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`, // ส่ง Bearer token ใน header
                    'Content-Type': 'application/json'
                }
            }
        );
        const wallet = walletResponse.data.wallet;
        console.log('Wallet created:', wallet);
        //test create another fiat
        const fiatResponse = await axios.post(
            `${process.env.API_BASE_URL}/wallets/${wallet.wallet_id}/fiats`,
            {
                "currency": "USD",
                "balance": 1000
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`, // ส่ง Bearer token ใน header
                    'Content-Type': 'application/json'
                }
            }
        );
        const fiat = fiatResponse.data;
        console.log('Fiat created:', fiat);
        //test create another crypto
        const cryptoResponse = await axios.post(
            `${process.env.API_BASE_URL}/wallets/${wallet.wallet_id}/cryptos`,
            {
                "currency": "BTC",
                "balance": 0.5
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`, // ส่ง Bearer token ใน header
                    'Content-Type': 'application/json'
                }
            }
        );
        const crypto = cryptoResponse.data;
        console.log('Crypto created:', crypto);
        //test get all wallets
        const walletsResponse = await axios.get(
            `${process.env.API_BASE_URL}/wallets/${user.user_id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`, // ส่ง Bearer token ใน header
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Wallets:', walletsResponse.data);
        const walletId = wallet.wallet_id; 
        console.log('walletId:', walletId);
        //test get wallet by walletId
        const walletByIdResponse = await axios.get(
            `${process.env.API_BASE_URL}/wallets/wallet/${walletId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`, // ส่ง Bearer token ใน header
                    'Content-Type': 'application/json'
                  }
            }
        );
        console.log('Wallet by ID:', walletByIdResponse.data);
        //test deposit
        const depositResponse = await axios.post(
            `${process.env.API_BASE_URL}/wallets/${walletId}/fiats/USD/deposit`,
            {
                "amount": 500,
                "currency": "USD"
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`, // ส่ง Bearer token ใน header
                    'Content-Type': 'application/json'
                  }
            }
        );
        console.log('Deposit response:', depositResponse.data);
        //test withdraw
        const withdrawResponse = await axios.post(
            `${process.env.API_BASE_URL}/wallets/${walletId}/fiats/USD/withdraw`,
            {
                "amount": 200,
                "currency": "USD"
            },
            {
                headers: { 'Authorization': `Bearer ${token}`, // ส่ง Bearer token ใน header
                'Content-Type': 'application/json'
              }
            }
        );
        console.log('Withdraw response:', withdrawResponse.data);
        //test get all crypto
        const cryptosResponse = await axios.get(
            `${process.env.API_BASE_URL}/wallets/${walletId}/cryptos`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`, // ส่ง Bearer token ใน header
                    'Content-Type': 'application/json'
                  }
            }
        );
        console.log('Cryptos:', cryptosResponse.data);
        //test trade
        const tradeResponse = await axios.post(
            `${process.env.API_BASE_URL}/trades`,
            {
                "order_type": "buy",
                "wallet_id": walletId,
                "crypto_type": "BTC",
                "amount": 0.1,
                "price": 30000,
                "total_value": 3000,
                "price_currency": "USD"
            },
            {
                headers: { 'Authorization': `Bearer ${token}`, // ส่ง Bearer token ใน header
                'Content-Type': 'application/json'
              }
            }
        );
       
        //test create transaction 
        const transactionResponse = await axios.post(
            `${process.env.API_BASE_URL}/wallets/wallet/${walletId}/transactions`,
            {
                "transaction_type": "deposit",
                "crypto_type": "ETH",
                "amount": 0.005,
                "external_address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
                "description": "create transaction test",
                
            },
            {
                headers: { 'Authorization': `Bearer ${token}`, // ส่ง Bearer token ใน header
                'Content-Type': 'application/json'
              }
            }
        );
        console.log('Transaction response:', transactionResponse.data);
       
       



        console.log('✅ Seeding complete!');
    } catch (error) {
        console.error('❌ Error seeding:', error);
        process.exit(1);
    }

}

seed();
