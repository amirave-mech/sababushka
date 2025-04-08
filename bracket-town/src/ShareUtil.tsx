/**
 * Exports for sharing and clipboard functionality
 */

export const shareNative = (shareText: string): boolean => {
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent))
        return shareSMS(shareText);

    return shareToClipboard(shareText);
}

/**
 * Handles sharing results via the user's preferred app using Web Share API
 * Falls back to SMS URL scheme if Web Share API is not available
 * @param currentPuzzleDate The date of the current puzzle
 * @param generateShareText Function that returns the text to share
 */
export const shareSMS = (shareText: string): boolean => {
    // Check if Web Share API is available
    let success = false;

    if (navigator.share) {
        navigator.share({
            title: 'תוצאות',
            text: shareText
        })
            .then(() => {
                console.log('Successfully shared results');
                success = true;
            })
            .catch((error: DOMException) => {
                console.error('Error sharing results:', error);
                // Fall back to SMS URL scheme if sharing fails
                if (!error.toString().includes('AbortError'))
                    success = fallbackToSMS(shareText);
            });
    } else {
        // Fall back to SMS URL scheme for older browsers
        success = fallbackToSMS(shareText);
    }

    return success;
};

/**
 * Fallback method to use SMS URL scheme when Web Share API is not available
 * @param shareText The text to share
 */
const fallbackToSMS = (shareText: string): boolean => {
    const encodedText = encodeURIComponent(shareText);
    // Use correct SMS URL scheme format
    window.location.href = `sms:?&body=${encodedText}`;

    return true;
};

/**
 * Copies results to clipboard for desktop sharing
 * @param currentPuzzleDate The date of the current puzzle
 * @param generateShareText Function that returns the text to share
 * @param root The root DOM element
 */
export const shareToClipboard = (shareText: string): boolean => {
    let success = false;

    // Use navigator.clipboard API for modern browsers
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText)
            .then(() => {
                success = true;
            })
            .catch(err => {
                console.error('Failed to copy results: ', err);
                // Show error or fallback to execCommand
                success = fallbackCopyToClipboard(shareText);
            });
    } else {
        // Fallback for older browsers
        success = fallbackCopyToClipboard(shareText);
    }

    return success;
};

/**
 * Fallback method to copy text to clipboard using execCommand
 * @param text Text to copy
 */
const fallbackCopyToClipboard = (_shareText: string): boolean => {
    // try {
    //     const textArea = document.createElement('textarea');
    //     textArea.value = text;
    //     textArea.style.position = 'fixed';  // Avoid scrolling to bottom
    //     document.body.appendChild(textArea);
    //     textArea.focus();
    //     textArea.select();

    //     const successful = document.execCommand('copy');
    //     if (successful) {
    //         // Show success message
    //         const shareMessage = root.querySelector('.share-message');
    //         if (shareMessage) {
    //             shareMessage.style.display = 'block';
    //             setTimeout(() => {
    //                 shareMessage.style.display = 'none';
    //             }, 2000);
    //         }
    //     } else {
    //         console.error('execCommand failed');
    //     }

    //     document.body.removeChild(textArea);
    // } catch (err) {
    //     console.error('Fallback copy method failed: ', err);
    // }

    return false;
};