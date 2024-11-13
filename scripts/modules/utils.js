function formatCount(count) {
    if (count >= 100000) {
        return `${(count / 1000).toFixed(0)}k`;
    }
    if (count >= 10000) {
        return `${(count / 1000).toFixed(0)}k`;
    }
    if (count >= 1000) {
        return `${(count / 1000).toFixed(0)}k`;
    }
    return count;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function titleOverflow(title) {
    if (title.length > 26) {
        return `${title.slice(0, 26)}...`;
    }
    return title;
}

function formatContentAsParagraphs(content) {
    const paragraphs = content
        .split('\n')
        .map((paragraph) => `<p>${paragraph}</p>`);
    return paragraphs.join('');
}

export { formatCount, formatDate, titleOverflow, formatContentAsParagraphs };
