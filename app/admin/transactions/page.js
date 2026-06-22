'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, X, CreditCard, TrendingUp, IndianRupee } from 'lucide-react';

const CATEGORIES = [
  { value: 'marketing', label: 'Marketing' },
  { value: 'travel', label: 'Travel' },
  { value: 'tools', label: 'Tools & Software' },
  { value: 'food', label: 'Food & Entertainment' },
  { value: 'operations', label: 'Operations' },
  { value: 'salaries', label: 'Salaries' },
  { value: 'other', label: 'Other' },
];

const CATEGORY_COLORS = {
  marketing:  'bg-pink-100 text-pink-700',
  travel:     'bg-blue-100 text-blue-700',
  tools:      'bg-purple-100 text-purple-700',
  food:       'bg-yellow-100 text-yellow-700',
  operations: 'bg-green-100 text-green-700',
  salaries:   'bg-orange-100 text-orange-700',
  other:      'bg-gray-100 text-gray-600',
};

const empty = {
  amount: '',
  merchant: '',
  purpose: '',
  card_holder: 'karan',
  category: 'other',
  transaction_date: new Date().toISOString().split('T')[0],
  notes: '',
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [submitting, setSubmitting] = useState(false);
  const [filterCard, setFilterCard] = useState('all');
  const [filterCat, setFilterCat] = useState('all');
  const [deleteId, setDeleteId] = useState(null);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterCard !== 'all') params.set('card_holder', filterCard);
    if (filterCat !== 'all') params.set('category', filterCat);
    const res = await fetch(`/api/transactions?${params}`);
    const data = await res.json();
    setTransactions(data.transactions || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [filterCard, filterCat]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.transaction) {
      setShowForm(false);
      setForm(empty);
      load();
    }
    setSubmitting(false);
  }

  async function handleDelete(id) {
    await fetch(`/api/transactions?id=${id}`, { method: 'DELETE' });
    setDeleteId(null);
    load();
  }

  const karanTotal = transactions.filter(t => t.card_holder === 'karan').reduce((s, t) => s + t.amount, 0);
  const lakshayTotal = transactions.filter(t => t.card_holder === 'lakshay').reduce((s, t) => s + t.amount, 0);
  const grandTotal = karanTotal + lakshayTotal;

  const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Card Transactions</h1>
          <p className="text-gray-400 text-sm mt-1">Track company card expenses — Karan & Lakshay</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#E8651A] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#d45a17] transition-colors">
          <Plus size={16} /> Add Transaction
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#E8651A]/10 rounded-xl flex items-center justify-center">
              <IndianRupee size={18} className="text-[#E8651A]" />
            </div>
            <p className="text-sm text-gray-500 font-medium">Total Spent</p>
          </div>
          <p className="text-2xl font-bold text-[#1a1a2e]">{fmt(grandTotal)}</p>
          <p className="text-xs text-gray-400 mt-1">{transactions.length} transactions</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <CreditCard size={18} className="text-blue-500" />
            </div>
            <p className="text-sm text-gray-500 font-medium">Karan's Card</p>
          </div>
          <p className="text-2xl font-bold text-[#1a1a2e]">{fmt(karanTotal)}</p>
          <p className="text-xs text-gray-400 mt-1">{transactions.filter(t => t.card_holder === 'karan').length} transactions</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <CreditCard size={18} className="text-green-500" />
            </div>
            <p className="text-sm text-gray-500 font-medium">Lakshay's Card</p>
          </div>
          <p className="text-2xl font-bold text-[#1a1a2e]">{fmt(lakshayTotal)}</p>
          <p className="text-xs text-gray-400 mt-1">{transactions.filter(t => t.card_holder === 'lakshay').length} transactions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-white">
          {['all', 'karan', 'lakshay'].map(c => (
            <button key={c} onClick={() => setFilterCard(c)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${filterCard === c ? 'bg-[#1a1a2e] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              {c === 'all' ? 'All Cards' : `${c === 'karan' ? '🔵' : '🟢'} ${c.charAt(0).toUpperCase() + c.slice(1)}`}
            </button>
          ))}
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#E8651A]">
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {/* Transactions table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-[#E8651A] border-t-transparent rounded-full" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-20 text-center">
            <TrendingUp size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No transactions yet. Add your first one!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-5 text-gray-400 font-medium text-xs uppercase tracking-wider">Date</th>
                  <th className="text-left py-3 px-5 text-gray-400 font-medium text-xs uppercase tracking-wider">Merchant</th>
                  <th className="text-left py-3 px-5 text-gray-400 font-medium text-xs uppercase tracking-wider">Purpose</th>
                  <th className="text-left py-3 px-5 text-gray-400 font-medium text-xs uppercase tracking-wider">Category</th>
                  <th className="text-left py-3 px-5 text-gray-400 font-medium text-xs uppercase tracking-wider">Card</th>
                  <th className="text-right py-3 px-5 text-gray-400 font-medium text-xs uppercase tracking-wider">Amount</th>
                  <th className="py-3 px-5"></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-5 text-gray-400 whitespace-nowrap">
                      {new Date(t.transaction_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-5 font-medium text-[#1a1a2e]">{t.merchant}</td>
                    <td className="py-3.5 px-5 text-gray-600 max-w-[200px]">
                      <p className="truncate">{t.purpose}</p>
                      {t.notes && <p className="text-xs text-gray-400 truncate">{t.notes}</p>}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${CATEGORY_COLORS[t.category] || CATEGORY_COLORS.other}`}>
                        {CATEGORIES.find(c => c.value === t.category)?.label || t.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${t.card_holder === 'karan' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {t.card_holder.charAt(0).toUpperCase() + t.card_holder.slice(1)}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right font-bold text-[#1a1a2e]">{fmt(t.amount)}</td>
                    <td className="py-3.5 px-5">
                      <button onClick={() => setDeleteId(t.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 border-t-2 border-gray-100">
                  <td colSpan={5} className="py-3.5 px-5 text-sm font-semibold text-gray-600">Total ({transactions.length} transactions)</td>
                  <td className="py-3.5 px-5 text-right font-bold text-[#1a1a2e] text-base">{fmt(transactions.reduce((s, t) => s + t.amount, 0))}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-bold text-[#1a1a2e] text-lg">Add Transaction</h2>
              <button onClick={() => { setShowForm(false); setForm(empty); }} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Card holder toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Whose Card?</label>
                <div className="flex rounded-xl overflow-hidden border border-gray-200">
                  {['karan', 'lakshay'].map(c => (
                    <button type="button" key={c} onClick={() => setForm(f => ({ ...f, card_holder: c }))}
                      className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${form.card_holder === c ? (c === 'karan' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white') : 'text-gray-500 hover:bg-gray-50'}`}>
                      {c === 'karan' ? '🔵' : '🟢'} {c.charAt(0).toUpperCase() + c.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
                  <input type="number" required min="1" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder="5000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input type="date" required value={form.transaction_date} onChange={e => setForm(f => ({ ...f, transaction_date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Merchant / Paid To *</label>
                <input required value={form.merchant} onChange={e => setForm(f => ({ ...f, merchant: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder="e.g. Meta Ads, Zomato, AWS" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose *</label>
                <input required value={form.purpose} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder="e.g. Instagram ads for Spiti batch" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A] bg-white">
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A] resize-none" placeholder="Any extra context..." />
              </div>

              <button type="submit" disabled={submitting}
                className="w-full bg-[#E8651A] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#d45a17] disabled:opacity-50 transition-colors">
                {submitting ? 'Saving...' : 'Add Transaction'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-[#1a1a2e] mb-2">Delete transaction?</h3>
            <p className="text-gray-500 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
