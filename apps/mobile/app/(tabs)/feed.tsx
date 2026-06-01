import React, { useMemo } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

import { PostCard, Post } from "../../components/PostCard";
import { PostCardSkeleton } from "../../components/skeletons/PostCardSkeleton";
import { useFeed } from "../../hooks/useFeed";
import { useTheme } from "../../theme/useTheme";

const SKELETON_COUNT = 4;

function SkeletonList() {
  return (
    <>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </>
  );
}

function EmptyState({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.center}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyTitle}>No posts yet</Text>
      <Text style={styles.emptySubtitle}>Be the first to post on Linkora!</Text>
    </View>
  );
}

function ErrorState({
  message,
  styles,
}: {
  message: string;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.center}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

export default function FeedScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { posts, loading, error, loadMore, refresh } = useFeed();

  const isInitialLoad = loading && posts.length === 0;

  if (isInitialLoad) {
    return (
      <View style={styles.container}>
        <SkeletonList />
      </View>
    );
  }

  if (error && posts.length === 0) {
    return <ErrorState message={error} styles={styles} />;
  }

  return (
    <FlatList<Post>
      style={styles.container}
      contentContainerStyle={posts.length === 0 ? styles.emptyContainer : styles.listContent}
      data={posts}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <PostCard post={item} />}
      ListEmptyComponent={<EmptyState styles={styles} />}
      ListFooterComponent={
        loading && posts.length > 0 ? (
          <ActivityIndicator style={styles.footer} color={theme.colors.brand.primary} size="small" />
        ) : null
      }
      onEndReached={loadMore}
      onEndReachedThreshold={0.4}
      refreshControl={
        <RefreshControl
          refreshing={loading && posts.length > 0}
          onRefresh={refresh}
          tintColor={theme.colors.brand.primary}
          colors={[theme.colors.brand.primary]}
        />
      }
    />
  );
}

function createStyles(theme: ReturnType<typeof useTheme>["theme"]) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface.background,
    },
    listContent: {
      paddingVertical: 8,
    },
    emptyContainer: {
      flex: 1,
    },
    center: {
      flex: 1,
      backgroundColor: theme.colors.surface.background,
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
    },
    emptyIcon: {
      fontSize: 48,
      marginBottom: 12,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 6,
    },
    emptySubtitle: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      textAlign: "center",
    },
    errorText: {
      color: theme.colors.semantic.error,
      fontSize: 14,
      textAlign: "center",
    },
    footer: {
      paddingVertical: 16,
    },
  });
}
