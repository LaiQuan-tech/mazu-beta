import React, { useState, useEffect } from 'react';
import { Announcement, AnnouncementCategory } from '../types';
import { getAnnouncements } from '../services/firebase';
import { Calendar, Tag, ChevronRight, Megaphone, Pin } from 'lucide-react';

const BulletinBoard: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements();
        setAnnouncements(data);
        setFilteredAnnouncements(data);
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (activeCategory === '全部') {
      setFilteredAnnouncements(announcements);
    } else {
      setFilteredAnnouncements(announcements.filter(ann => ann.category === activeCategory));
    }
  }, [activeCategory, announcements]);

  const categories = ['全部', ...Object.values(AnnouncementCategory)];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-temple-red"></div>
      </div>
    );
  }

  return (
    <section id="bulletin" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-temple-red font-serif text-lg font-bold tracking-widest mb-2 flex items-center justify-center gap-2">
            <Megaphone className="w-5 h-5" />
            最新消息
          </h2>
          <h3 className="text-4xl font-bold text-temple-dark mb-4 font-serif">
            宮廟公佈欄
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            掌握和聖壇的大小事，包含法會公告、重要通知與宮廟動態。
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-temple-red text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Announcements List */}
        <div className="grid gap-6">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((ann) => (
              <div 
                key={ann.id} 
                className={`bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden ${
                  ann.isPinned ? 'border-temple-gold bg-yellow-50/30' : 'border-gray-100'
                }`}
              >
                {ann.isPinned && (
                  <div className="absolute top-0 right-0 bg-temple-gold text-white px-3 py-1 text-xs font-bold flex items-center gap-1 rounded-bl-lg">
                    <Pin className="w-3 h-3" /> 置頂
                  </div>
                )}
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        ann.category === AnnouncementCategory.IMPORTANT ? 'bg-red-100 text-red-600' :
                        ann.category === AnnouncementCategory.EVENT ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {ann.category}
                      </span>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {ann.date}
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2 font-serif">
                      {ann.title}
                    </h4>
                    <p className="text-gray-600 line-clamp-2">
                      {ann.content}
                    </p>
                  </div>
                  <button className="flex items-center text-temple-red font-bold hover:gap-2 transition-all">
                    查看詳情 <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-gray-500">
              目前尚無此分類的公告。
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BulletinBoard;
