// src/hooks/usePermisos.js
import { useEffect, useMemo } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';


const normalizeFlag = (v) => {
  if (typeof v === 'boolean') return v;
  const n = Number(v);
  if (!Number.isNaN(n)) return n > 0;
  return !!v;
};


const extractActions = (p) => {
  const list = Array.isArray(p?.permisos) ? p.permisos : null;

  if (list) {
    return {
      canRead: list.includes('read'),
      canCreate: list.includes('create'),
      canUpdate: list.includes('update'),
      canDelete: list.includes('delete'),
    };
  }

  return {
    canRead: normalizeFlag(p?.read),
    canCreate: normalizeFlag(p?.create),
    canUpdate: normalizeFlag(p?.update),
    canDelete: normalizeFlag(p?.delete),
  };
};


export default function usePermisos({ redirectOnMissing = true } = {}) {
  const auth = useSelector((s) => s.authUser);
  const location = useLocation();
  const history = useHistory();

  const { permiso, pathname } = useMemo(() => {
    const pathname = location?.pathname || window?.location?.pathname || '/';
    const permisos = auth?.user?.permisos || [];

    const permiso =
      permisos.find((p) => {
        const url = p?.modulo?.url || '';
        return url && pathname.startsWith(url);
      }) || null;

    return { permiso, pathname };
  }, [auth?.user?.permisos, location?.pathname]);

  const found = !!permiso;
  const actions = extractActions(permiso);

  useEffect(() => {
    if (redirectOnMissing && !found) {
      history.push('/');
    }
  }, [redirectOnMissing, found, history]);


  const has = (action) => {
    switch (action) {
      case 'read': return !!actions.canRead;
      case 'create': return !!actions.canCreate;
      case 'update': return !!actions.canUpdate;
      case 'delete': return !!actions.canDelete;
      default: return false;
    }
  };

  return {
    ...actions,       // canRead, canCreate, canUpdate, canDelete
    permiso,          // objeto permiso bruto encontrado
    found,            // bool
    pathname,         // ruta actual
    has,              // helper
  };
}
