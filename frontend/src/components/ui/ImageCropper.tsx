'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { ZoomIn, ZoomOut, Loader2 } from 'lucide-react';

interface ImageCropperProps {
    image: string; // Data URL of the image
    onCropComplete: (croppedImageBlob: Blob) => void;
    onCancel: () => void;
    aspectRatio?: number;
    cropShape?: 'rect' | 'round';
}

interface CropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

export default function ImageCropper({
    image,
    onCropComplete,
    onCancel,
    aspectRatio = 1,
    cropShape = 'rect'
}: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
    const [processing, setProcessing] = useState(false);

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteInternal = useCallback((croppedArea: any, croppedAreaPixels: CropArea) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createCroppedImage = async () => {
        if (!croppedAreaPixels) return;

        setProcessing(true);
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const imageElement = new Image();
            imageElement.src = image;

            await new Promise((resolve) => {
                imageElement.onload = resolve;
            });

            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            ctx.drawImage(
                imageElement,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            );

            canvas.toBlob((blob) => {
                if (blob) {
                    onCropComplete(blob);
                }
                setProcessing(false);
            }, 'image/jpeg', 0.95);
        } catch (error) {
            console.error('Error cropping image:', error);
            setProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-800">
                    <h3 className="text-lg font-bold text-white">Crop Image</h3>
                    <p className="text-sm text-gray-400 mt-1">
                        Drag to reposition • Scroll or use slider to zoom
                    </p>
                </div>

                {/* Cropper Area */}
                <div className="relative bg-black" style={{ height: '400px' }}>
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspectRatio}
                        cropShape={cropShape}
                        onCropChange={onCropChange}
                        onZoomChange={onZoomChange}
                        onCropComplete={onCropCompleteInternal}
                        style={{
                            containerStyle: {
                                backgroundColor: '#000',
                            },
                            cropAreaStyle: {
                                border: '2px solid #f97316',
                            },
                        }}
                    />
                </div>

                {/* Zoom Controls */}
                <div className="p-4 border-t border-gray-800 bg-[#0f0f10]">
                    <div className="flex items-center gap-3">
                        <ZoomOut className="w-5 h-5 text-gray-400" />
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                        <ZoomIn className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-400 w-12 text-right">
                            {Math.round(zoom * 100)}%
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-gray-800 flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={processing}
                        className="flex-1 px-4 py-2.5 bg-gray-800 text-gray-300 font-medium rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={createCroppedImage}
                        disabled={processing}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            'Apply Crop'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
