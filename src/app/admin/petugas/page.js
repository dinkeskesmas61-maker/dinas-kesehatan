'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function PetugasListPage() {
  const [petugasList, setPetugasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPetugas, setSelectedPetugas] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch Data Petugas dari Firestore
  const fetchPetugas = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const list = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setPetugasList(list);
    } catch (error) {
      console.error('Error fetching petugas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPetugas();
  }, []);

  // Filter Data berdasarkan Search
  const filteredList = petugasList.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.puskesmas?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hapus Petugas
  const handleDelete = async (emailId) => {
    if (confirm(`Apakah Anda yakin ingin menghapus petugas dengan email: ${emailId}?`)) {
      try {
        await deleteDoc(doc(db, 'users', emailId));
        setPetugasList((prev) => prev.filter((item) => item.id !== emailId));
      } catch (error) {
        alert('Gagal menghapus data: ' + error.message);
      }
    }
  };

  // Update Status / Role Petugas
  const handleUpdatePetugas = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, 'users', selectedPetugas.id);
      await updateDoc(docRef, {
        name: selectedPetugas.name,
        role: selectedPetugas.role,
        puskesmas: selectedPetugas.puskesmas,
        status: selectedPetugas.status,
        phone: selectedPetugas.phone || null,
        nip: selectedPetugas.nip || null,
      });

      setIsEditModalOpen(false);
      fetchPetugas();
    } catch (error) {
      alert('Gagal memperbarui data: ' + error.message);
    }
  };

  return (
    <main className="min-h-screen bg-surface-container-lowest p-6 lg:p-10 text-on-surface">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">Manajemen Petugas</h1>
            <p className="text-xs text-on-surface-variant mt-1">
              Kelola data akun petugas Puskesmas dan Admin Dinas Kesehatan
            </p>
          </div>
          <Link
            href="/admin/petugas/tambah"
            className="px-4 py-2.5 rounded-full text-xs font-bold bg-primary text-on-primary hover:bg-primary/90 transition flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">person_add</span>
            Tambah Petugas
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-2xl border border-outline-variant">
          <div className="relative w-full max-w-xs">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Cari nama, email, atau puskesmas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface-container-highest border-none rounded-xl text-xs text-on-surface focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <p className="text-xs text-on-surface-variant font-medium hidden sm:block">
            Total: <span className="font-bold text-on-surface">{filteredList.length}</span> Petugas
          </p>
        </div>

        {/* Data Table */}
        <div className="bg-surface-container-low rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-high/50 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                  <th className="p-4">Pengguna</th>
                  <th className="p-4">Unit Kerja</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-xs">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center p-8 text-on-surface-variant">
                      Memuat data petugas...
                    </td>
                  </tr>
                ) : filteredList.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-8 text-on-surface-variant">
                      Tidak ada data petugas ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container transition-colors">
                      {/* Name & Email */}
                      <td className="p-4">
                        <div className="font-bold text-on-surface">{item.name || 'Tanpa Nama'}</div>
                        <div className="text-[11px] text-on-surface-variant">{item.email}</div>
                        {item.nip && <div className="text-[10px] text-outline mt-0.5">NIP: {item.nip}</div>}
                      </td>

                      {/* Puskesmas */}
                      <td className="p-4 font-medium text-on-surface-variant">
                        {item.puskesmas || '-'}
                      </td>

                      {/* Role Badge */}
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            item.role === 'admin' || item.role === 'dinkes'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                              : 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300'
                          }`}
                        >
                          {item.role === 'admin' || item.role === 'dinkes' ? 'Admin Dinkes' : 'Petugas'}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="p-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                          }`}
                        >
                          {item.status === 'active' ? 'Aktif' : 'Non-Aktif'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setSelectedPetugas(item);
                              setIsEditModalOpen(true);
                            }}
                            className="p-1.5 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container-high transition"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-on-surface-variant hover:text-red-600 rounded-lg hover:bg-surface-container-high transition"
                            title="Hapus"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Quick Edit Modal */}
      {isEditModalOpen && selectedPetugas && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-primary border-b border-outline-variant pb-2">
              Edit Data Petugas
            </h3>

            <form onSubmit={handleUpdatePetugas} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-on-surface-variant mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={selectedPetugas.name || ''}
                  onChange={(e) => setSelectedPetugas({ ...selectedPetugas, name: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-container-highest rounded-xl border-none text-on-surface focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface-variant mb-1">Puskesmas / Unit Kerja</label>
                <input
                  type="text"
                  value={selectedPetugas.puskesmas || ''}
                  onChange={(e) => setSelectedPetugas({ ...selectedPetugas, puskesmas: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-container-highest rounded-xl border-none text-on-surface focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface-variant mb-1">Role</label>
                  <select
                    value={selectedPetugas.role || 'petugas'}
                    onChange={(e) => setSelectedPetugas({ ...selectedPetugas, role: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container-highest rounded-xl border-none text-on-surface focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="petugas">Petugas</option>
                    <option value="admin">Admin Dinkes</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-on-surface-variant mb-1">Status Akun</label>
                  <select
                    value={selectedPetugas.status || 'active'}
                    onChange={(e) => setSelectedPetugas({ ...selectedPetugas, status: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container-highest rounded-xl border-none text-on-surface focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Non-Aktif</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-full font-bold text-on-surface-variant hover:bg-surface-container-high transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full font-bold bg-primary text-on-primary hover:bg-primary/90 transition"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}