import React, { useState, useEffect, useRef } from 'react';
import type { Bookmark, GraphNode, GraphEdge, NodeType } from '../types';
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Search, 
  ExternalLink, 
  Sparkles
} from 'lucide-react';

interface LinkageGraphViewProps {
  bookmarks: Bookmark[];
  onOpenReader: (b: Bookmark) => void;
}

export const LinkageGraphView: React.FC<LinkageGraphViewProps> = ({
  bookmarks,
  onOpenReader,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [searchGraph, setSearchGraph] = useState('');
  const [filterType, setFilterType] = useState<NodeType | 'all'>('all');

  const nodesRef = useRef<GraphNode[]>([]);
  const edgesRef = useRef<GraphEdge[]>([]);
  const draggingNodeRef = useRef<GraphNode | null>(null);

  // Generate graph nodes & edges from bookmarks
  useEffect(() => {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const tagNodeMap = new Map<string, string>();
    const collectionNodeMap = new Map<string, string>();

    // 1. Link Nodes
    bookmarks.forEach((bm, i) => {
      const angle = (i / bookmarks.length) * Math.PI * 2;
      const radius = 180 + Math.random() * 80;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      const linkNodeId = `node-link-${bm.id}`;
      nodes.push({
        id: linkNodeId,
        label: bm.title,
        type: 'link',
        color: '#D3FF69',
        val: 18,
        x,
        y,
        vx: 0,
        vy: 0,
        subText: bm.domain,
        linkId: bm.id,
        connections: [],
      });

      // 2. Collection Nodes & Edges
      if (bm.collection) {
        let colNodeId = collectionNodeMap.get(bm.collection);
        if (!colNodeId) {
          colNodeId = `node-col-${bm.collection}`;
          collectionNodeMap.set(bm.collection, colNodeId);
          nodes.push({
            id: colNodeId,
            label: bm.collection,
            type: 'collection',
            color: '#53FFA9',
            val: 26,
            x: x + (Math.random() - 0.5) * 100,
            y: y + (Math.random() - 0.5) * 100,
            vx: 0,
            vy: 0,
            subText: 'Collection Hub',
            connections: [],
          });
        }
        edges.push({ source: linkNodeId, target: colNodeId });
      }

      // 3. Tag Nodes & Edges
      bm.tags.forEach((tag) => {
        let tagNodeId = tagNodeMap.get(tag);
        if (!tagNodeId) {
          tagNodeId = `node-tag-${tag}`;
          tagNodeMap.set(tag, tagNodeId);
          nodes.push({
            id: tagNodeId,
            label: `#${tag}`,
            type: 'tag',
            color: '#9A99FE',
            val: 22,
            x: x + (Math.random() - 0.5) * 140,
            y: y + (Math.random() - 0.5) * 140,
            vx: 0,
            vy: 0,
            subText: 'Tag Cluster',
            connections: [],
          });
        }
        edges.push({ source: linkNodeId, target: tagNodeId });
      });
    });

    // Populate connection IDs for node inspection
    edges.forEach((edge) => {
      const srcNode = nodes.find((n) => n.id === edge.source);
      const tgtNode = nodes.find((n) => n.id === edge.target);
      if (srcNode && tgtNode) {
        if (!srcNode.connections.includes(tgtNode.id)) srcNode.connections.push(tgtNode.id);
        if (!tgtNode.connections.includes(srcNode.id)) tgtNode.connections.push(srcNode.id);
      }
    });

    nodesRef.current = nodes;
    edgesRef.current = edges;
  }, [bookmarks]);

  // Force-directed simulation loop & Canvas render
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const simulateAndRender = () => {
      // Handle canvas resizing
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2 + pan.x;
      const centerY = height / 2 + pan.y;

      // Simple 2D force relaxation step
      const nodes = nodesRef.current;
      const edges = edgesRef.current;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x! - n1.x!;
          const dy = n2.y! - n1.y!;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 180) {
            const force = (180 - dist) / dist * 0.05;
            n1.vx! -= dx * force;
            n1.vy! -= dy * force;
            n2.vx! += dx * force;
            n2.vy! += dy * force;
          }
        }
      }

      // Edge spring force
      edges.forEach((edge) => {
        const source = nodes.find((n) => n.id === edge.source);
        const target = nodes.find((n) => n.id === edge.target);
        if (source && target) {
          const dx = target.x! - source.x!;
          const dy = target.y! - source.y!;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (dist - 100) * 0.005;
          source.vx! += dx * force;
          source.vy! += dy * force;
          target.vx! -= dx * force;
          target.vy! -= dy * force;
        }
      });

      // Update positions with damping
      nodes.forEach((n) => {
        if (n !== draggingNodeRef.current) {
          n.vx! *= 0.85;
          n.vy! *= 0.85;
          n.x! += n.vx!;
          n.y! += n.vy!;
        }
      });

      // RENDER CANVAS
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(zoom, zoom);

      // Render Edges
      edges.forEach((edge) => {
        const source = nodes.find((n) => n.id === edge.source);
        const target = nodes.find((n) => n.id === edge.target);
        if (source && target) {
          // Check filter
          if (filterType !== 'all' && source.type !== filterType && target.type !== filterType) {
            return;
          }

          const isConnectedToSelected =
            selectedNode && (selectedNode.id === source.id || selectedNode.id === target.id);

          ctx.beginPath();
          ctx.moveTo(source.x!, source.y!);
          ctx.lineTo(target.x!, target.y!);
          ctx.strokeStyle = isConnectedToSelected
            ? 'rgba(83, 255, 169, 0.8)'
            : 'rgba(255, 255, 255, 0.12)';
          ctx.lineWidth = isConnectedToSelected ? 2.5 : 1;
          ctx.stroke();
        }
      });

      // Render Nodes (Bubbles)
      nodes.forEach((n) => {
        if (filterType !== 'all' && n.type !== filterType) return;
        if (searchGraph.trim() && !n.label.toLowerCase().includes(searchGraph.toLowerCase())) return;

        const isSelected = selectedNode?.id === n.id;
        const isConnected = selectedNode?.connections.includes(n.id);

        ctx.beginPath();
        ctx.arc(n.x!, n.y!, n.val, 0, Math.PI * 2);

        // Glow effect
        if (isSelected || isConnected) {
          ctx.shadowColor = n.color;
          ctx.shadowBlur = isSelected ? 25 : 12;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = isSelected ? n.color : `${n.color}DD`;
        ctx.fill();

        ctx.strokeStyle = isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.stroke();

        // Node Label
        ctx.shadowBlur = 0;
        ctx.font = isSelected ? '700 13px "PT Sans Caption"' : '600 11px "Outfit"';
        ctx.fillStyle = isSelected ? '#FFFFFF' : '#FAFCFE';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.label, n.x!, n.y! + n.val + 14);
      });

      ctx.restore();

      animId = requestAnimationFrame(simulateAndRender);
    };

    simulateAndRender();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [pan, zoom, selectedNode, filterType, searchGraph]);

  // Canvas Mouse Interactivity
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2 + pan.x;
    const centerY = height / 2 + pan.y;

    // Convert click to graph coordinates
    const graphX = (clientX - centerX) / zoom;
    const graphY = (clientY - centerY) / zoom;

    // Check hit node
    const hitNode = nodesRef.current.find((n) => {
      const dx = n.x! - graphX;
      const dy = n.y! - graphY;
      return Math.sqrt(dx * dx + dy * dy) <= n.val + 5;
    });

    if (hitNode) {
      setSelectedNode(hitNode);
      draggingNodeRef.current = hitNode;
    } else {
      setIsDraggingCanvas(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggingNodeRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2 + pan.x;
      const centerY = height / 2 + pan.y;

      draggingNodeRef.current.x = (clientX - centerX) / zoom;
      draggingNodeRef.current.y = (clientY - centerY) / zoom;
      draggingNodeRef.current.vx = 0;
      draggingNodeRef.current.vy = 0;
    } else if (isDraggingCanvas) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    draggingNodeRef.current = null;
    setIsDraggingCanvas(false);
  };

  return (
    <div className="relative w-full h-[calc(100vh-61px)] overflow-hidden bg-[#000203] flex">
      
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3 flex-wrap">
        <div className="qd-glass px-4 py-2 rounded-full flex items-center gap-3 shadow-lg">
          <div className="w-8 h-8 rounded-full bg-[#53FFA9]/20 flex items-center justify-center text-[#53FFA9]">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-caption font-bold text-sm text-[#FAFCFE]">Linkage Graph</h2>
            <p className="text-[10px] font-mono text-[#8A8F98]">Obsidian 2D Force-Directed Cluster</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="qd-glass p-1.5 rounded-full flex items-center gap-1 shadow-lg">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-full text-xs font-caption font-semibold transition-all ${
              filterType === 'all' ? 'bg-[#53FFA9] text-[#000203]' : 'text-[#8A8F98] hover:text-[#FAFCFE]'
            }`}
          >
            All Nodes
          </button>
          <button
            onClick={() => setFilterType('link')}
            className={`px-3 py-1 rounded-full text-xs font-caption font-semibold transition-all ${
              filterType === 'link' ? 'bg-[#D3FF69] text-[#000203]' : 'text-[#8A8F98] hover:text-[#FAFCFE]'
            }`}
          >
            Links
          </button>
          <button
            onClick={() => setFilterType('tag')}
            className={`px-3 py-1 rounded-full text-xs font-caption font-semibold transition-all ${
              filterType === 'tag' ? 'bg-[#9A99FE] text-[#000203]' : 'text-[#8A8F98] hover:text-[#FAFCFE]'
            }`}
          >
            Tags
          </button>
          <button
            onClick={() => setFilterType('collection')}
            className={`px-3 py-1 rounded-full text-xs font-caption font-semibold transition-all ${
              filterType === 'collection' ? 'bg-[#97C8EC] text-[#000203]' : 'text-[#8A8F98] hover:text-[#FAFCFE]'
            }`}
          >
            Collections
          </button>
        </div>

        {/* Search */}
        <div className="qd-glass px-3.5 py-2 rounded-full flex items-center gap-2 shadow-lg">
          <Search className="w-3.5 h-3.5 text-[#8A8F98]" />
          <input
            type="text"
            value={searchGraph}
            onChange={(e) => setSearchGraph(e.target.value)}
            placeholder="Highlight graph node..."
            className="bg-transparent text-xs text-[#FAFCFE] placeholder:text-[#8A8F98] focus:outline-none w-32 font-medium"
          />
        </div>
      </div>

      {/* Floating Zoom Controls */}
      <div className="absolute bottom-6 left-6 z-20 flex items-center gap-1.5 qd-glass p-1.5 rounded-full shadow-lg">
        <button
          onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
          className="p-2 rounded-full bg-[#242529] hover:bg-[#373B3E] text-slate-300 hover:text-[#FAFCFE] transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.4, z - 0.2))}
          className="p-2 rounded-full bg-[#242529] hover:bg-[#373B3E] text-slate-300 hover:text-[#FAFCFE] transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
          className="p-2 rounded-full bg-[#242529] hover:bg-[#373B3E] text-slate-300 hover:text-[#FAFCFE] transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Right Inspector Drawer */}
      {selectedNode && (
        <aside className="absolute top-4 right-4 bottom-4 w-80 z-20 qd-glass rounded-[24px] p-6 shadow-2xl flex flex-col justify-between animate-pop-fade">
          <div>
            <div className="flex items-center justify-between pb-3">
              <span className="font-caption font-bold text-xs uppercase tracking-wider text-[#53FFA9] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Node Inspector
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-xs text-[#8A8F98] hover:text-[#FAFCFE]"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-4 h-4 rounded-full shadow-sm"
                  style={{ backgroundColor: selectedNode.color }}
                />
                <span className="font-caption font-bold text-base text-[#FAFCFE] truncate">
                  {selectedNode.label}
                </span>
              </div>

              <div className="p-4 bg-[#242529] rounded-2xl text-xs space-y-1.5 font-mono">
                <div className="text-[#8A8F98]">Type: <span className="text-[#97C8EC] uppercase font-bold">{selectedNode.type}</span></div>
                <div className="text-[#8A8F98]">Connections: <span className="text-[#53FFA9] font-bold">{selectedNode.connections.length} nodes</span></div>
                {selectedNode.subText && <div className="text-[#8A8F98] truncate">Domain: {selectedNode.subText}</div>}
              </div>

              {/* Connected Links Preview */}
              {selectedNode.linkId && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      const bm = bookmarks.find((b) => b.id === selectedNode.linkId);
                      if (bm) onOpenReader(bm);
                    }}
                    className="w-full py-3 bg-[#53FFA9] text-[#000203] font-caption font-bold text-xs rounded-full flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all"
                  >
                    <span>Open Reader Mode</span>
                    <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="text-[10px] font-mono text-[#8A8F98] text-center pt-3">
            Click and drag nodes to adjust force topology.
          </div>
        </aside>
      )}

    </div>
  );
};
