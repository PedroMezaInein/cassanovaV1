import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Stack } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, Delete, AttachFile } from '@mui/icons-material';
import { DropZone } from '../form-components';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from '../../functions/routers';
import { ShowFile } from './ShowFile';

const ItemSlider2 = ({ items = [], deleteFile, handleChange, item, multiple = true, accept }) => {
    const [active, setActive] = useState(0);

    // Reset al primer slide cuando cambia la lista
    useEffect(() => {
        if (items.length === 0) {
            setActive(0); // solo DropZone
        } else if (active > items.length) {
            setActive(items.length); // apunta al slot de carga
        }
    }, [items, active]);


    const handleFileChange = (files) => {
        if (handleChange) {
            const archivosConUrl = files
                .filter((file) => file instanceof File)
                .map((file) => ({
                    id: `${Date.now()}-${Math.random()}`, // 👈 id único
                    name: file.name,
                    url: URL.createObjectURL(file), // 👈 crea URL temporal única
                    fileOriginal: file,
                }));

            handleChange(archivosConUrl, item);

            // Opcional: ir al último archivo nuevo
            setActive(items.length + archivosConUrl.length - 1);
        }
    };
    const sliderBack = () => {
        const max = items.length; // último índice es DropZone
        setActive((prev) => (prev <= 0 ? max : prev - 1));
    };

    const sliderNext = () => {
        const max = items.length;
        setActive((prev) => (prev >= max ? 0 : prev + 1));
    };

    const isEnablePrevButton = () => items.length > 0 || active > 0;
    const isEnableNextButton = () => items.length > 0 || active < items.length;



    return (
        <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                <IconButton disabled={!isEnablePrevButton()} onClick={sliderBack}>
                    <ArrowBackIos />
                </IconButton>

                <Box flexGrow={1} display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                    {active === items.length ? (
                        <DropZone accept={accept} multiple={multiple} handleChange={handleFileChange}>
                            <Box textAlign="center" p={2}>
                                <SVG src={toAbsoluteUrl('/images/svg/upload-arrow.svg')} width={60} height={60} />
                                <Typography variant="body1">
                                    {items.length === 0 ? 'Haga clic para cargar archivos' : 'Haga clic para cargar más archivos'}
                                </Typography>
                            </Box>
                        </DropZone>
                    ) : (
                        items[active] && <ShowFile key={items[active].id} item={items[active]} />
                    )}
                </Box>


                <IconButton disabled={!isEnableNextButton()} onClick={sliderNext}>
                    <ArrowForwardIos />
                </IconButton>
            </Stack>

            {items.length > 0 && active < items.length && (items[active]?.url || items[active]?.url_temporal) && (
                <Box mt={2} textAlign="center">
                    {deleteFile && (
                        <IconButton
                            color="error"
                            onClick={() => {
                                // limpia la URL local si aplica
                                if (items[active]?.fileOriginal && items[active]?.url) {
                                    URL.revokeObjectURL(items[active].url);
                                }
                                deleteFile(items[active]);
                            }}
                        >
                            <Delete />
                        </IconButton>
                    )}
                    <Box mt={1}>
                        <a
                            href={items[active].url || items[active].url_temporal}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'none', color: '#5f6368' }}
                        >
                            <AttachFile fontSize="small" />
                            <Typography variant="body2" display="inline">
                                Ver archivo
                            </Typography>
                        </a>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default ItemSlider2;
