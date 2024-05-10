export function translateEdgeName(index: number): string {
    switch (index) {
        case 0: return '下连杆';
        case 1: return '后连杆';
        case 2: return '上连杆';
        case 3: return '前连杆';
        default: return '';
    }
}