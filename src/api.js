export const fetchProducts = async (page, pageSize) => {
    try {
        const response = await fetch('/rest/mail/get_mail_page', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                page,
                page_size: pageSize
            }),
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.status}`);
        }

        const result = await response.json();

        if (result.code !== 0) {
            throw new Error(result.message || 'API returned error code');
        }

        const { items, total } = result.data;

        // Map email data to table structure
        const products = items.map((item) => {
            return {
                id: item.id,
                uid: item.uid,
                subject: item.subject || 'No Subject',
                sender: item.from_email || 'Unknown Sender',
                to_email: item.to_email || '',
                date: item.time_date,
                status: item.email_status,
                content: item.content || '',
            };
        });

        console.log(`Fetched products from API: page=${page}, pageSize=${pageSize}`, { page, page_size: pageSize });

        return {
            data: products,
            total: total,
            page,
            pageSize
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        // Fallback to empty state or re-throw depending on desired behavior
        return {
            data: [],
            total: 0,
            page,
            pageSize
        };
    }
};
