import { useEffect, useState } from 'react';
import { Image } from 'primereact/image';
import { ProgressSpinner } from 'primereact/progressspinner';
import { fetchEvidenciaImagen } from './consulta/service';

export interface EvidenciaItemProps {
    nombre: string;
    token?: string;
    getRequest?: (params: { url: string; token: string }) => Promise<any>;
    idFicha?: number;
    index: number;
}

export const EvidenciaItem = ({ nombre, token, getRequest, idFicha, index }: EvidenciaItemProps) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        let isMounted = true;
        let objectUrl = '';

        setLoading(true);
        setError(false);

        fetchEvidenciaImagen(token, getRequest, nombre)
            .then((url) => {
                if (isMounted) {
                    if (url) {
                        objectUrl = url;
                        setImageSrc(url);
                    } else {
                        setError(true);
                    }
                }
            })
            .catch((err) => {
                console.error(`Error al cargar evidencia ${nombre}:`, err);
                if (isMounted) {
                    setError(true);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
            if (objectUrl && objectUrl.startsWith('blob:')) {
                window.URL.revokeObjectURL(objectUrl);
            }
        };
    }, [nombre, token, getRequest]);

    if (loading) {
        return (
            <div className="flex flex-column align-items-center justify-content-center surface-100 border-round border-1 surface-border p-3" style={{ width: '180px', height: '140px' }}>
                <ProgressSpinner style={{ width: '30px', height: '30px' }} />
                <span className="text-xs text-500 mt-2">Cargando imagen...</span>
            </div>
        );
    }

    if (error || !imageSrc) {
        return (
            <div className="flex flex-column align-items-center justify-content-center surface-100 border-round border-1 surface-border p-2 text-center" style={{ width: '180px', minHeight: '140px' }}>
                <i className="pi pi-exclamation-triangle text-orange-500 text-2xl mb-1"></i>
                <span className="text-xs text-700 font-medium break-all">{nombre}</span>
                <span className="text-xs text-500 mt-1">No se pudo cargar</span>
            </div>
        );
    }

    return (
        <div className="flex flex-column align-items-center gap-1">
            <div className="border-round shadow-1 overflow-hidden surface-50 border-1 surface-border flex justify-content-center align-items-center" style={{ width: '180px', height: '130px' }}>
                <Image
                    src={imageSrc}
                    alt={`Evidencia ${index + 1} - Ficha ${idFicha ?? ''}`}
                    width="180"
                    imageStyle={{ maxHeight: '130px', width: 'auto', objectFit: 'contain' }}
                    preview
                />
            </div>
            <span className="text-xs text-600 truncate max-w-11rem text-center" title={nombre}>
                {/* {nombre} */}
            </span>
        </div>
    );
};
