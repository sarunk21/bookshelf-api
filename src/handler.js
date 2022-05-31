/* eslint-disable indent */
/* eslint-disable max-len */
const { nanoid } = require('nanoid');
const bookshelf = require('./bookshelf');

// Menyimpan Buku
const addBookHandler = (req, h) => {
    // Get data
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = req.payload;

    // System Set data
    const id = nanoid(16);
    const finished = false;
    const insertedAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();

    // Validasi -------------------------------------------------------------------------------------------------------
        // Cek jika name kosong
        if (name === undefined || name === '') {
            const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon isi nama buku',
            });
            response.code(400);
            return response;
        }

        // Cek jika readpage lebih dari pagecount
        if (readPage > pageCount) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400);
            return response;
        }

    // End validasi ---------------------------------------------------------------------------------------------------

    // Set book objek
    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt,
    };

    // Push book to bookshelf
    bookshelf.push(newBook);

    // Check if book alreadt stored
    const isSuccess = bookshelf.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    // Throw error jika gagal menambahkan buku
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

// Menampilkan semua buku
const getAllBooksHandler = (req, h) => {
    // Ambil semua data query
    const { name, reading, finished } = req.query;

    // Cek jika ada query name
    if (name !== undefined && name !== '') {
        // Cari buku berdasarkan nama
        const books = bookshelf.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));

        // Jika name yang dicari ada
        if (books.length > 0) {
            return {
                status: 'success',
                data: books,
            };
        }

        // Jika name yang dicari tidak ada
        const response = h.response({
            status: 'fail',
            message: `Buku dengan ${name} tidak ditemukan`,
        });
        response.code(404);
        return response;
    }

    // Cek jika ada query reading
    if (reading !== undefined && reading !== '') {
        // Cari buku yang sedang dibaca
        if (reading === '1') {
            const books = bookshelf.filter((book) => book.reading === true);

            const response = h.response({
                status: 'success',
                data: books,
            });
            response.code(200);
            return response;
        }

        // Cari buku yang tidak dibaca
        if (reading === '0') {
            const books = bookshelf.filter((book) => book.reading === false);

            const response = h.response({
                status: 'success',
                data: books,
            });
            response.code(200);
            return response;
        }

        // Jika reading bukan 1 atau 0
        const response = h.response({
            status: 'fail',
            message: 'Query reading hanya boleh 1 atau 0',
        });
        response.code(400);
        return response;
    }

    // Cek jika ada query finished
    if (finished !== undefined && finished !== '') {
        // Cari buku yang sudah selesai
        if (finished === '1') {
            const books = bookshelf.filter((book) => book.finished === true);

            const response = h.response({
                status: 'success',
                data: books,
            });
            response.code(200);
            return response;
        }

        // Cari buku yang belum selesai
        if (finished === '0') {
            const books = bookshelf.filter((book) => book.finished === false);

            const response = h.response({
                status: 'success',
                data: books,
            });
            response.code(200);
            return response;
        }

        // Jika finished bukan 1 atau 0
        const response = h.response({
            status: 'fail',
            message: 'Query finished hanya boleh 1 atau 0',
        });
        response.code(400);
        return response;
    }

    // Jika tidak ada query, kembalikan semua data buku
    const response = h.response({
        status: 'success',
        data: bookshelf,
    });
    response.code(200);
    return response;
};

// Menampilkan detail buku
const getBookHandler = (req, h) => {
    // Ambil id dari url
    const { bookId } = req.params;

    // Cek apakah buku ada di bookshelf
    const book = bookshelf.filter((b) => b.id === bookId)[0];

    // Jika buku ada
    if (book !== undefined) {
        return {
            status: 'success',
            data: book,
        };
    }

    // Jika buku tidak ada
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

// Ubah detail buku
const updateBookHandler = (req, h) => {
    // Get bookId
    const { bookId } = req.params;

    // Cari buku di bookshelf
    const index = bookshelf.findIndex((book) => book.id === bookId);

    // Get data
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading, finished,
    } = req.payload;

    // System Set data
    const updatedAt = new Date().toISOString();

    // Validasi -------------------------------------------------------------------------------------------------------
        // Cek jika name kosong
        if (name === undefined || name === '') {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            });
            response.code(400);
            return response;
        }

        // Cek jika readpage lebih dari pagecount
        if (readPage > pageCount) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400);
            return response;
        }

    // End validasi ---------------------------------------------------------------------------------------------------

    // Jika buku ada
    if (index !== -1) {
        // Update data
        bookshelf[index] = {
            ...bookshelf[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

// Menghapus buku daru bookshelf
const deleteBookHandler = (req, h) => {
    // Get bookId
    const { bookId } = req.params;

    // Cari buku di bookshelf
    const index = bookshelf.findIndex((book) => book.id === bookId);

    // Jika buku ada
    if (index !== -1) {
        // Hapus buku pada bookshelf
        bookshelf.splice(index, 1);

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    // Jika buku tidak ada
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
 addBookHandler, getAllBooksHandler, getBookHandler, updateBookHandler, deleteBookHandler,
};
