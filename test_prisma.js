import pkg from '@prisma/client';
const { PrismaClient } = pkg;

console.log('Testing PrismaClient instantiation...');
try {
    const prisma = new PrismaClient();
    console.log('Success with no args');
} catch (e) {
    console.log('Failed with no args:', e.message);
    try {
        const prisma = new PrismaClient({});
        console.log('Success with {}');
    } catch (e2) {
        console.log('Failed with {}:', e2.message);
    }
}
