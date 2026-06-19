#!/usr/bin/env python3
"""
Advanced Airliner GLB Generator
Generates a realistic 3D airliner model in GLB format with proper geometry
Requires: pip install struct json numpy
"""

import struct
import json
import math

def create_advanced_airliner_glb():
    """Create an advanced airliner model in GLB format"""
    
    vertices = []
    indices = []
    
    # ==================== FUSELAGE (Body) ====================
    fuselage_segments = 20
    fuselage_radius = 0.4
    fuselage_length = 3.0
    
    # Create fuselage cylinder
    for i in range(fuselage_segments + 1):
        angle = (i / fuselage_segments) * 2 * math.pi
        z = -fuselage_length / 2 + (i / fuselage_segments) * fuselage_length
        for j in range(fuselage_segments):
            theta = (j / fuselage_segments) * 2 * math.pi
            x = fuselage_radius * math.cos(theta)
            y = fuselage_radius * math.sin(theta)
            vertices.append([x, y, z])
    
    # Create fuselage faces
    for i in range(fuselage_segments):
        for j in range(fuselage_segments):
            v1 = i * fuselage_segments + j
            v2 = i * fuselage_segments + (j + 1) % fuselage_segments
            v3 = (i + 1) * fuselage_segments + j
            v4 = (i + 1) * fuselage_segments + (j + 1) % fuselage_segments
            
            indices.extend([v1, v2, v3])
            indices.extend([v2, v4, v3])
    
    # ==================== COCKPIT ====================
    cockpit_start = len(vertices)
    for i in range(fuselage_segments):
        theta = (i / fuselage_segments) * 2 * math.pi
        x = fuselage_radius * 0.6 * math.cos(theta)
        y = fuselage_radius * 0.6 * math.sin(theta) + fuselage_radius * 0.3
        z = -fuselage_length / 2 - 0.3
        vertices.append([x, y, z])
    
    # Cockpit point
    vertices.append([0, fuselage_radius * 0.9, -fuselage_length / 2 - 0.5])
    cockpit_tip = len(vertices) - 1
    
    for j in range(fuselage_segments - 1):
        v1 = cockpit_start + j
        v2 = cockpit_start + j + 1
        indices.extend([v1, v2, cockpit_tip])
    
    # ==================== WINGS ====================
    wing_start = len(vertices)
    wing_length = 2.5
    wing_thickness = 0.1
    wing_chord = 0.8
    
    for side in [-1, 1]:  # Left and right wings
        # Wing root
        for i in range(10):
            x = side * (fuselage_radius + (i / 10) * wing_length)
            y = 0
            z = wing_thickness / 2
            vertices.append([x, y, z])
            z = -wing_thickness / 2
            vertices.append([x, y, z])
        
        # Wing tip
        x = side * (fuselage_radius + wing_length)
        y = wing_chord * 0.5
        z = wing_thickness / 4
        vertices.append([x, y, z])
        z = -wing_thickness / 4
        vertices.append([x, y, z])
    
    # Wing faces
    wing_segments = 10
    for side_idx in range(2):
        base = wing_start + side_idx * (wing_segments * 2 + 2)
        for i in range(wing_segments):
            v1 = base + i * 2
            v2 = base + i * 2 + 1
            v3 = base + i * 2 + 2
            v4 = base + i * 2 + 3
            
            indices.extend([v1, v3, v2])
            indices.extend([v2, v3, v4])
    
    # ==================== VERTICAL STABILIZER ====================
    vstab_start = len(vertices)
    vstab_height = 0.8
    vstab_depth = 0.6
    
    # Base of vertical stabilizer
    for i in range(8):
        theta = (i / 8) * math.pi
        x = fuselage_radius * 0.5 * math.cos(theta)
        y = 0
        z = fuselage_length / 2 - 0.5
        vertices.append([x, y, z])
    
    # Top of vertical stabilizer
    vertices.append([0, 0, fuselage_length / 2 - 0.5 + vstab_height])
    vstab_tip = len(vertices) - 1
    
    # Back of vertical stabilizer
    for i in range(8):
        theta = (i / 8) * math.pi
        x = fuselage_radius * 0.5 * math.cos(theta)
        y = vstab_depth
        z = fuselage_length / 2 - 0.5
        vertices.append([x, y, z])
    
    # Vertical stabilizer faces
    for i in range(7):
        v1 = vstab_start + i
        v2 = vstab_start + i + 1
        v3 = vstab_start + 8 + i
        v4 = vstab_start + 8 + i + 1
        
        indices.extend([v1, v2, vstab_tip])
        indices.extend([v3, v4, vstab_tip + 1])
    
    # ==================== HORIZONTAL STABILIZER ====================
    hstab_start = len(vertices)
    hstab_length = 1.0
    hstab_chord = 0.4
    
    # Left horizontal stabilizer
    vertices.append([-fuselage_radius * 0.3, fuselage_length / 2 - 0.5, 0])
    vertices.append([-fuselage_radius * 0.3 - hstab_length, fuselage_length / 2 - 0.5, 0])
    vertices.append([-fuselage_radius * 0.3, fuselage_length / 2 - 0.5 + hstab_chord, 0])
    vertices.append([-fuselage_radius * 0.3 - hstab_length, fuselage_length / 2 - 0.5 + hstab_chord, 0])
    
    # Right horizontal stabilizer
    vertices.append([fuselage_radius * 0.3, fuselage_length / 2 - 0.5, 0])
    vertices.append([fuselage_radius * 0.3 + hstab_length, fuselage_length / 2 - 0.5, 0])
    vertices.append([fuselage_radius * 0.3, fuselage_length / 2 - 0.5 + hstab_chord, 0])
    vertices.append([fuselage_radius * 0.3 + hstab_length, fuselage_length / 2 - 0.5 + hstab_chord, 0])
    
    # Horizontal stabilizer faces
    for i in range(2):
        base = hstab_start + i * 4
        indices.extend([base, base + 1, base + 2])
        indices.extend([base + 1, base + 3, base + 2])
    
    # ==================== LANDING GEAR ====================
    gear_start = len(vertices)
    
    # Main gear
    vertices.append([-0.3, -fuselage_radius - 0.1, 0])
    vertices.append([-0.3, -fuselage_radius - 0.5, 0])
    vertices.append([0.3, -fuselage_radius - 0.1, 0])
    vertices.append([0.3, -fuselage_radius - 0.5, 0])
    
    # Nose gear
    vertices.append([0, -fuselage_radius - 0.1, -fuselage_length / 2 + 0.5])
    vertices.append([0, -fuselage_radius - 0.4, -fuselage_length / 2 + 0.5])
    
    # Gear struts faces
    indices.extend([gear_start, gear_start + 1, gear_start + 2])
    indices.extend([gear_start + 1, gear_start + 3, gear_start + 2])
    indices.extend([gear_start + 4, gear_start + 5, gear_start])
    
    # ==================== ENGINES ====================
    engine_start = len(vertices)
    
    for side in [-1, 1]:
        engine_x = side * 0.6
        engine_z = -0.2
        
        # Engine intake
        for i in range(8):
            theta = (i / 8) * 2 * math.pi
            x = engine_x + 0.15 * math.cos(theta)
            y = -fuselage_radius + 0.15 * math.sin(theta)
            vertices.append([x, y, engine_z])
        
        # Engine center
        vertices.append([engine_x, -fuselage_radius, engine_z - 0.5])
    
    # ==================== Convert to bytes ====================
    vertices_flat = []
    for v in vertices:
        vertices_flat.extend(v)
    
    vertices_bytes = b''.join(struct.pack('<f', v) for v in vertices_flat)
    indices_bytes = b''.join(struct.pack('<H', i) for i in indices)
    
    # ==================== Create glTF JSON ====================
    gltf = {
        "asset": {
            "generator": "Advanced Airliner Generator",
            "version": "2.0"
        },
        "scene": 0,
        "scenes": [{"nodes": [0]}],
        "nodes": [{"mesh": 0}],
        "meshes": [{
            "primitives": [{
                "attributes": {"POSITION": 0},
                "indices": 1,
                "mode": 4
            }],
            "name": "Airliner"
        }],
        "accessors": [
            {
                "bufferView": 0,
                "componentType": 5126,
                "count": len(vertices),
                "type": "VEC3",
                "min": [-2.0, -1.5, -2.0],
                "max": [2.0, 1.5, 2.0]
            },
            {
                "bufferView": 1,
                "componentType": 5123,
                "count": len(indices),
                "type": "SCALAR"
            }
        ],
        "bufferViews": [
            {
                "buffer": 0,
                "byteLength": len(vertices_bytes),
                "byteOffset": 0,
                "target": 34962
            },
            {
                "buffer": 0,
                "byteLength": len(indices_bytes),
                "byteOffset": len(vertices_bytes),
                "target": 34963
            }
        ],
        "buffers": [{
            "byteLength": len(vertices_bytes) + len(indices_bytes)
        }]
    }
    
    json_str = json.dumps(gltf)
    json_bytes = json_str.encode('utf-8')
    
    # Pad JSON to 4-byte boundary
    json_padding = (4 - (len(json_bytes) % 4)) % 4
    json_bytes += b' ' * json_padding
    
    # ==================== Create GLB file ====================
    glb_data = b'glTF'
    glb_data += struct.pack('<I', 2)
    glb_data += struct.pack('<I', 28 + len(json_bytes) + len(vertices_bytes) + len(indices_bytes))
    
    # JSON chunk
    glb_data += struct.pack('<I', len(json_bytes))
    glb_data += b'JSON'
    glb_data += json_bytes
    
    # BIN chunk
    bin_data = vertices_bytes + indices_bytes
    glb_data += struct.pack('<I', len(bin_data))
    glb_data += b'BIN\0'
    glb_data += bin_data
    
    return glb_data

if __name__ == "__main__":
    import os
    
    # Create output directory
    os.makedirs("assets/aircraft", exist_ok=True)
    
    # Generate and save
    glb_data = create_advanced_airliner_glb()
    
    with open("assets/aircraft/airliner.glb", 'wb') as f:
        f.write(glb_data)
    
    print(f"✓ Advanced Airliner model created!")
    print(f"  Path: assets/aircraft/airliner.glb")
    print(f"  Size: {len(glb_data)} bytes")
    print(f"  Features:")
    print(f"    - Realistic fuselage with cockpit")
    print(f"    - Two wings with proper geometry")
    print(f"    - Vertical stabilizer")
    print(f"    - Horizontal stabilizers")
    print(f"    - Landing gear (main + nose)")
    print(f"    - Two turbine engines")
