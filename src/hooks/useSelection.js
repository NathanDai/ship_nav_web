import { useState, useCallback } from 'react';

/**
 * 选择状态管理 Hook
 * @param {Array} items - 可选择的项目列表
 * @param {Function} isSelectable - 判断项目是否可选择的函数
 * @returns {object} 选择状态和操作方法
 */
export const useSelection = (items = [], isSelectable = () => true) => {
    const [selected, setSelected] = useState([]);

    // 切换全选
    const toggleSelectAll = useCallback((checked) => {
        if (checked) {
            const selectableIds = items
                .filter(item => isSelectable(item))
                .map(item => item.id);
            setSelected(selectableIds);
        } else {
            setSelected([]);
        }
    }, [items, isSelectable]);

    // 切换单个选择
    const toggleSelect = useCallback((id) => {
        setSelected(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    }, []);

    // 判断是否选中
    const isSelected = useCallback((id) => {
        return selected.includes(id);
    }, [selected]);

    // 判断是否全选
    const isAllSelected = useCallback(() => {
        const selectableItems = items.filter(item => isSelectable(item));
        return selectableItems.length > 0 &&
            selectableItems.every(item => selected.includes(item.id));
    }, [items, selected, isSelectable]);

    // 清空选择
    const clearSelection = useCallback(() => {
        setSelected([]);
    }, []);

    return {
        selected,
        toggleSelectAll,
        toggleSelect,
        isSelected,
        isAllSelected,
        clearSelection
    };
};
