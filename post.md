# Sơ đồ EER (Enhanced Entity-Relationship)

## Tổng quan mối quan hệ

```mermaid
erDiagram
    %% ===== ENTITIES =====
    
    SITE {
        string id PK
        string name
        string description
        string logo
        json seo
        json navigation
        json social
    }
    
    AUTHOR {
        string slug PK
        string name
        string avatar
        string bio
        string role
        json social
        datetime createdAt
    }
    
    TOPIC {
        string slug PK
        string name
        string description
        string icon
        string color
        int order
    }
    
    CLUSTER {
        string slug PK
        string topicSlug FK
        string name
        string description
        string thumbnail
        int order
    }
    
    RESOURCE {
        string slug PK
        string name
        string description
        string icon
        string thumbnail
    }
    
    COLLECTION {
        string slug PK
        string name
        string description
        string thumbnail
        string curatorSlug FK
        datetime createdAt
        datetime updatedAt
    }
    
    POST {
        string slug PK
        string title
        string excerpt
        string thumbnail
        string content_html
        string type
        string clusterSlug FK "nullable - for series"
        string resourceSlug FK "nullable - for standalone"
        string authorSlug FK
        datetime publishedAt
        datetime updatedAt
        int readingTime
        boolean featured
    }
    
    TAG {
        string slug PK
        string name
        int postCount
    }
    
    %% ===== RELATIONSHIPS =====
    
    %% Topic - Cluster (1:N)
    TOPIC ||--o{ CLUSTER : "contains"
    
    %% Cluster - Post (1:N) - Series posts
    CLUSTER ||--o{ POST : "has series posts"
    
    %% Resource - Post (1:N) - Standalone posts
    RESOURCE ||--o{ POST : "has standalone posts"
    
    %% Author - Post (1:N)
    AUTHOR ||--o{ POST : "writes"
    
    %% Author - Collection (1:N)
    AUTHOR ||--o{ COLLECTION : "curates"
    
    %% Post - Tag (M:N)
    POST }o--o{ TAG : "tagged with"
    
    %% Collection - Post (M:N)
    COLLECTION }o--o{ POST : "includes"
```

## Chi tiết các mối quan hệ

### 1. Phân cấp Nội dung (Content Hierarchy)

```mermaid
flowchart TD
    subgraph "SERIES POSTS (3 levels)"
        T[Topic] --> C[Cluster]
        C --> SP[Series Post]
    end
    
    subgraph "STANDALONE POSTS (2 levels)"
        R[Resource] --> STP[Standalone Post]
    end
    
    subgraph "CURATED CONTENT"
        COL[Collection] -.-> SP
        COL -.-> STP
    end
    
    style T fill:#e1f5fe
    style C fill:#b3e5fc
    style SP fill:#81d4fa
    style R fill:#fff3e0
    style STP fill:#ffe0b2
    style COL fill:#f3e5f5
```

### 2. URL Pattern theo Entity

```mermaid
flowchart LR
    subgraph "URL PATTERNS"
        direction TB
        
        subgraph "Series Path"
            T1["/{topic}/"] --> C1["/{topic}/{cluster}/"]
            C1 --> P1["/{topic}/{cluster}/{post}.html"]
        end
        
        subgraph "Standalone Path"
            R1["/{resource}/"] --> P2["/{resource}/{post}.html"]
        end
        
        subgraph "Collection Path"
            COL1["/{collection}/index.html"]
        end
        
        subgraph "Other Pages"
            TAG1["/tag/{tag}/"]
            AUTH1["/author/{author}/"]
        end
    end
```

### 3. Post Types & Relationships

```mermaid
classDiagram
    class Post {
        +string slug
        +string title
        +string excerpt
        +string content_html
        +string type
        +datetime publishedAt
    }
    
    class SeriesPost {
        +string clusterSlug
        +getCluster()
        +getTopic()
    }
    
    class StandalonePost {
        +string resourceSlug
        +getResource()
    }
    
    class Cluster {
        +string slug
        +string topicSlug
        +getPosts()
        +getTopic()
    }
    
    class Resource {
        +string slug
        +getPosts()
    }
    
    class Topic {
        +string slug
        +getClusters()
        +getAllPosts()
    }
    
    Post <|-- SeriesPost : extends
    Post <|-- StandalonePost : extends
    
    SeriesPost "N" --> "1" Cluster : belongs to
    StandalonePost "N" --> "1" Resource : belongs to
    Cluster "N" --> "1" Topic : belongs to
```

### 4. Many-to-Many Relationships

```mermaid
erDiagram
    POST ||--o{ POST_TAG : has
    TAG ||--o{ POST_TAG : tagged_in
    POST_TAG {
        string postSlug FK
        string tagSlug FK
    }
    
    COLLECTION ||--o{ COLLECTION_POST : contains
    POST ||--o{ COLLECTION_POST : included_in
    COLLECTION_POST {
        string collectionSlug FK
        string postSlug FK
        int order
    }
```

## Bảng tóm tắt quan hệ

| Entity A | Relationship | Entity B | Cardinality | Mô tả |
|----------|-------------|----------|-------------|-------|
| Topic | contains | Cluster | 1:N | Mỗi Topic có nhiều Cluster |
| Cluster | has | Post (series) | 1:N | Mỗi Cluster có nhiều bài viết series |
| Resource | has | Post (standalone) | 1:N | Mỗi Resource có nhiều bài viết standalone |
| Author | writes | Post | 1:N | Mỗi Author viết nhiều bài |
| Author | curates | Collection | 1:N | Mỗi Author có thể tạo nhiều Collection |
| Post | tagged_with | Tag | M:N | Bài viết có nhiều tag, tag gắn nhiều bài |
| Collection | includes | Post | M:N | Collection chứa nhiều bài, bài nằm trong nhiều collection |

## Entity Constraints

```mermaid
flowchart TB
    subgraph "POST CONSTRAINTS"
        P[Post]
        P --> |"IF type = 'series'"| C1["clusterSlug REQUIRED<br/>resourceSlug NULL"]
        P --> |"IF type = 'standalone'"| C2["resourceSlug REQUIRED<br/>clusterSlug NULL"]
    end
    
    subgraph "UNIQUE CONSTRAINTS"
        U1["Topic.slug UNIQUE"]
        U2["Cluster.slug UNIQUE per Topic"]
        U3["Post.slug UNIQUE globally"]
        U4["Resource.slug UNIQUE"]
        U5["Collection.slug UNIQUE"]
    end
```

## Data Flow khi Generate Static Site

```mermaid
sequenceDiagram
    participant DB as Database/JSON
    participant SSG as SSG Script
    participant FS as File System
    
    Note over DB,FS: 1. Load all data
    SSG->>DB: Load site.json
    SSG->>DB: Load topics.json
    SSG->>DB: Load clusters.json
    SSG->>DB: Load resources.json
    SSG->>DB: Load posts.json
    SSG->>DB: Load collections.json
    SSG->>DB: Load authors.json
    SSG->>DB: Load tags.json
    
    Note over DB,FS: 2. Generate pages
    SSG->>FS: Generate index.html (Home)
    
    loop Each Topic
        SSG->>FS: Generate /{topic}/index.html
        loop Each Cluster in Topic
            SSG->>FS: Generate /{topic}/{cluster}/index.html
            loop Each Post in Cluster
                SSG->>FS: Generate /{topic}/{cluster}/{post}.html
            end
        end
    end
    
    loop Each Resource
        SSG->>FS: Generate /{resource}/index.html
        loop Each Post in Resource
            SSG->>FS: Generate /{resource}/{post}.html
        end
    end
    
    loop Each Collection
        SSG->>FS: Generate /{collection}/index.html
    end
    
    loop Each Tag
        SSG->>FS: Generate /tag/{tag}/index.html
    end
    
    loop Each Author
        SSG->>FS: Generate /author/{author}/index.html
    end
    
    SSG->>FS: Generate sitemap.xml
    SSG->>FS: Generate robots.txt
```

## Physical Schema (nếu dùng SQL Database)

```sql
-- Topics table
CREATE TABLE topics (
    slug VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    "order" INT DEFAULT 0
);

-- Clusters table
CREATE TABLE clusters (
    slug VARCHAR(100) PRIMARY KEY,
    topic_slug VARCHAR(100) NOT NULL REFERENCES topics(slug),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail VARCHAR(500),
    "order" INT DEFAULT 0
);

-- Resources table
CREATE TABLE resources (
    slug VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    thumbnail VARCHAR(500)
);

-- Authors table
CREATE TABLE authors (
    slug VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    bio TEXT,
    role VARCHAR(100),
    social JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
    slug VARCHAR(200) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    excerpt TEXT,
    thumbnail VARCHAR(500),
    content_html TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('series', 'standalone')),
    cluster_slug VARCHAR(100) REFERENCES clusters(slug),
    resource_slug VARCHAR(100) REFERENCES resources(slug),
    author_slug VARCHAR(100) NOT NULL REFERENCES authors(slug),
    published_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    reading_time INT,
    featured BOOLEAN DEFAULT FALSE,
    
    -- Constraint: series posts must have cluster, standalone must have resource
    CONSTRAINT post_type_check CHECK (
        (type = 'series' AND cluster_slug IS NOT NULL AND resource_slug IS NULL) OR
        (type = 'standalone' AND resource_slug IS NOT NULL AND cluster_slug IS NULL)
    )
);

-- Tags table
CREATE TABLE tags (
    slug VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Post-Tag junction table (M:N)
CREATE TABLE post_tags (
    post_slug VARCHAR(200) REFERENCES posts(slug) ON DELETE CASCADE,
    tag_slug VARCHAR(100) REFERENCES tags(slug) ON DELETE CASCADE,
    PRIMARY KEY (post_slug, tag_slug)
);

-- Collections table
CREATE TABLE collections (
    slug VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail VARCHAR(500),
    curator_slug VARCHAR(100) REFERENCES authors(slug),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Collection-Post junction table (M:N with order)
CREATE TABLE collection_posts (
    collection_slug VARCHAR(100) REFERENCES collections(slug) ON DELETE CASCADE,
    post_slug VARCHAR(200) REFERENCES posts(slug) ON DELETE CASCADE,
    "order" INT DEFAULT 0,
    PRIMARY KEY (collection_slug, post_slug)
);

-- Indexes for performance
CREATE INDEX idx_posts_cluster ON posts(cluster_slug);
CREATE INDEX idx_posts_resource ON posts(resource_slug);
CREATE INDEX idx_posts_author ON posts(author_slug);
CREATE INDEX idx_posts_published ON posts(published_at DESC);
CREATE INDEX idx_clusters_topic ON clusters(topic_slug);
```

## View Diagram trên các công cụ

Bạn có thể copy các đoạn Mermaid code ở trên và paste vào:

1. **Mermaid Live Editor**: https://mermaid.live
2. **dbdiagram.io**: https://dbdiagram.io (cho SQL schema)
3. **draw.io**: https://draw.io (export SVG từ Mermaid)
4. **VS Code**: Cài extension "Markdown Preview Mermaid Support"
