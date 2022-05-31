const {
    addBookHandler, getAllBooksHandler, getBookHandler, updateBookHandler, deleteBookHandler,
} = require('./handler');

// Endpoint API
const routes = [
    // Menyimpan Buku
    {
        method: 'POST',
        path: '/books',
        handler: addBookHandler,
    },

    // Menampilkan semua buku
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksHandler,
    },

    // Menampilkan detail buku
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getBookHandler,
    },

    // Ubah detail buku
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: updateBookHandler,
    },

    // Menghapus data book
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookHandler,
    },
];

module.exports = routes;
