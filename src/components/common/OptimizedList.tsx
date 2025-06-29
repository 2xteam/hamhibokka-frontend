// src/components/common/OptimizedList.tsx
import React, {memo} from 'react';
import {FlatList, ListRenderItem} from 'react-native';

interface OptimizedListProps<T> {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  onEndReached?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  loading?: boolean;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
}

function OptimizedListComponent<T>({
  data,
  renderItem,
  keyExtractor,
  onEndReached,
  onRefresh,
  refreshing = false,
  loading = false,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
}: OptimizedListProps<T>) {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={ListEmptyComponent}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={10}
      getItemLayout={undefined} // 동적 높이인 경우 undefined
      showsVerticalScrollIndicator={false}
    />
  );
}

export const OptimizedList = memo(OptimizedListComponent) as <T>(
  props: OptimizedListProps<T>,
) => React.ReactElement;
