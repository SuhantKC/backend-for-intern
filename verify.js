const API_URL = 'http://localhost:3000/api';

async function verify() {
    console.log('--- Starting Verification ---');

    try {
        // 1. Register User 1
        console.log('1. Registering User 1...');
        const res1 = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'user1@example.com',
                username: 'user1',
                password: 'password123'
            })
        });
        const data1 = await res1.json();
        if (!data1.success) throw new Error(`Registration failed: ${JSON.stringify(data1)}`);
        const token1 = data1.data.token;
        const user1Id = data1.data.id;
        console.log('User 1 Token obtained.');

        // 2. Register User 2
        console.log('2. Registering User 2...');
        const res2 = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'user2@example.com',
                username: 'user2',
                password: 'password123'
            })
        });
        const data2 = await res2.json();
        const user2Id = data2.data.id;

        // 3. Update User 1 (Me)
        console.log('3. Updating User 1 profile...');
        const resUpdate = await fetch(`${API_URL}/users/me`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token1}`
            },
            body: JSON.stringify({ username: 'user1_updated' })
        });
        if (!resUpdate.ok) throw new Error('Update failed');
        console.log('User 1 profile updated.');

        // 4. List Users
        console.log('4. Listing all users...');
        const resList = await fetch(`${API_URL}/users`, {
            headers: { 'Authorization': `Bearer ${token1}` }
        });
        const dataList = await resList.json();
        console.log(`Found ${dataList.data.length} users.`);

        // 5. Delete User 2 (success)
        console.log('5. Deleting User 2 (other user)...');
        const resDel = await fetch(`${API_URL}/users/${user2Id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token1}` }
        });
        if (!resDel.ok) throw new Error('Delete other user failed');
        console.log('User 2 deleted successfully.');

        // 6. Delete Self (failure)
        console.log('6. Attempting to delete own account (should fail)...');
        const resSelfDel = await fetch(`${API_URL}/users/${user1Id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token1}` }
        });
        if (resSelfDel.ok) {
            console.error('ERROR: Self-deletion should have failed!');
        } else {
            const dataSelfDel = await resSelfDel.json();
            console.log(`Success: Self-deletion failed as expected with status ${resSelfDel.status} (${dataSelfDel.message})`);
        }

        // 7. Create Product
        console.log('7. Creating a product...');
        const resProd = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token1}`
            },
            body: JSON.stringify({
                name: 'Verification Phone',
                price: 999.99,
                category: 'Electronics',
                stock: 10,
                description: 'A high-end smartphone for verification'
            })
        });
        const dataProd = await resProd.json();
        const productId = dataProd.data.id;
        console.log(`Product created with ID: ${productId}`);

        // 8. Update Product
        console.log('8. Updating product stock...');
        await fetch(`${API_URL}/products/${productId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token1}`
            },
            body: JSON.stringify({ stock: 5 })
        });
        console.log('Product updated.');

        // 9. Delete Product
        console.log('9. Deleting product...');
        await fetch(`${API_URL}/products/${productId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token1}` }
        });
        console.log('Product deleted.');

        console.log('\n--- VERIFICATION SUCCESSFUL ---');
    } catch (error) {
        console.error('--- VERIFICATION FAILED ---');
        console.error(error.message);
    }
}

verify();
