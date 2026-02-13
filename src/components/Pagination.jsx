import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

const Pagination = ({ page, pageSize, total, onPageChange }) => {
    const totalPages = Math.ceil(total / pageSize);
    const startEntry = (page - 1) * pageSize + 1;
    const endEntry = Math.min(page * pageSize, total);

    if (total === 0) return null;

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        // Logic for showing page numbers with ellipsis could be added here
        // For now, simple list since total pages is small in mock
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    className={`page-btn ${i === page ? 'active' : ''}`}
                    onClick={() => onPageChange(i)}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="pagination-container">
            <div className="pagination-info">
                Showing {startEntry}-{endEntry} of {total} entries
            </div>

            <div className="pagination-controls">
                <button
                    className="nav-btn"
                    disabled={page === 1}
                    onClick={() => onPageChange(page - 1)}
                >
                    <ChevronLeft size={16} />
                    Previous
                </button>

                <div className="page-numbers">
                    {renderPageNumbers()}
                </div>

                <button
                    className="nav-btn"
                    disabled={page === totalPages}
                    onClick={() => onPageChange(page + 1)}
                >
                    Next
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
